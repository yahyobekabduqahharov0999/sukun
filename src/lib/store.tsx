import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "sukun.sanctuary.v1";

export type ReflectionEntry = {
  id: string;
  createdAt: string;
  updatedAt: string;
  prompt: string;
  text: string;
  mood: string;
};

export type GratitudeEntry = {
  items: [string, string, string];
  updatedAt: string;
};

export type Activity = {
  id: string;
  taskId: string;
  title: string;
  date: string;
  completedAt: string;
  note: string;
  minutes: number;
};

export type Goal = {
  id: string;
  title: string;
  why: string;
  createdAt: string;
  checkins: string[];
};

export type CustomPractice = {
  id: string;
  title: string;
  description: string;
  minutes: number;
};

export type Settings = {
  motion: "system" | "reduced" | "full";
  scene: "high" | "balanced" | "off";
  privacyBlur: boolean;
};

export type Profile = {
  name: string;
  intention: string;
  createdAt: string;
};

export type SukunState = {
  version: 1;
  profile: Profile;
  savedVerses: string[];
  savedArticles: string[];
  reflections: ReflectionEntry[];
  gratitude: Record<string, GratitudeEntry>;
  activities: Activity[];
  goals: Goal[];
  customPractices: CustomPractice[];
  settings: Settings;
};

const freshState = (): SukunState => ({
  version: 1,
  profile: { name: "", intention: "", createdAt: new Date().toISOString() },
  savedVerses: [],
  savedArticles: [],
  reflections: [],
  gratitude: {},
  activities: [],
  goals: [],
  customPractices: [],
  settings: { motion: "system", scene: "high", privacyBlur: false },
});

function normalizeState(parsed: Partial<SukunState>): SukunState {
  const base = freshState();
  const reflections = (Array.isArray(parsed.reflections) ? parsed.reflections : []).filter((entry): entry is ReflectionEntry => {
    const value = entry as ReflectionEntry;
    return !!value && [value.id, value.createdAt, value.updatedAt, value.prompt, value.text, value.mood].every((field) => typeof field === "string");
  });
  const activities = (Array.isArray(parsed.activities) ? parsed.activities : []).filter((entry): entry is Activity => {
    const value = entry as Activity;
    return !!value && [value.id, value.taskId, value.title, value.date, value.completedAt, value.note].every((field) => typeof field === "string") && Number.isFinite(value.minutes) && value.minutes >= 0;
  });
  const goals = (Array.isArray(parsed.goals) ? parsed.goals : []).filter((entry): entry is Goal => {
    const value = entry as Goal;
    return !!value && [value.id, value.title, value.why, value.createdAt].every((field) => typeof field === "string") && Array.isArray(value.checkins);
  }).map((goal) => ({ ...goal, checkins: goal.checkins.filter((date) => typeof date === "string") }));
  const customPractices = (Array.isArray(parsed.customPractices) ? parsed.customPractices : []).filter((entry): entry is CustomPractice => {
    const value = entry as CustomPractice;
    return !!value && [value.id, value.title, value.description].every((field) => typeof field === "string") && Number.isFinite(value.minutes) && value.minutes > 0;
  });
  const gratitude: Record<string, GratitudeEntry> = {};
  if (parsed.gratitude && typeof parsed.gratitude === "object" && !Array.isArray(parsed.gratitude)) {
    Object.entries(parsed.gratitude).forEach(([date, entry]) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date) && entry && Array.isArray(entry.items) && entry.items.length === 3 && entry.items.every((item) => typeof item === "string") && typeof entry.updatedAt === "string") {
        gratitude[date] = { items: [entry.items[0], entry.items[1], entry.items[2]], updatedAt: entry.updatedAt };
      }
    });
  }
  const motion = parsed.settings?.motion;
  const scene = parsed.settings?.scene;
  return {
    version: 1,
    profile: {
      name: typeof parsed.profile?.name === "string" ? parsed.profile.name : "",
      intention: typeof parsed.profile?.intention === "string" ? parsed.profile.intention : "",
      createdAt: typeof parsed.profile?.createdAt === "string" ? parsed.profile.createdAt : base.profile.createdAt,
    },
    savedVerses: Array.isArray(parsed.savedVerses) ? parsed.savedVerses.filter((id) => typeof id === "string") : [],
    savedArticles: Array.isArray(parsed.savedArticles) ? parsed.savedArticles.filter((id) => typeof id === "string") : [],
    reflections, activities, goals, customPractices, gratitude,
    settings: {
      motion: motion === "reduced" || motion === "full" ? motion : "system",
      scene: scene === "balanced" || scene === "off" ? scene : "high",
      privacyBlur: parsed.settings?.privacyBlur === true,
    },
  };
}

function readState(): SukunState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeState(JSON.parse(raw) as Partial<SukunState>) : freshState();
  } catch {
    return freshState();
  }
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatUzDate(value: string | Date, withYear = true) {
  const date = typeof value === "string" ? (value.includes("T") ? new Date(value) : fromDateKey(value)) : value;
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" } : {}),
  }).format(date);
}

type StoreValue = {
  state: SukunState;
  storageAvailable: boolean;
  toggleVerse: (id: string) => void;
  toggleArticle: (id: string) => void;
  saveReflection: (input: { id?: string; prompt: string; text: string; mood: string }) => string;
  deleteReflection: (id: string) => void;
  saveGratitude: (date: string, items: [string, string, string]) => void;
  deleteGratitude: (date: string) => void;
  completeActivity: (input: { taskId: string; title: string; date: string; note: string; minutes: number }) => void;
  removeActivity: (id: string) => void;
  addGoal: (title: string, why: string) => void;
  toggleGoalCheckin: (id: string, date: string) => void;
  deleteGoal: (id: string) => void;
  addCustomPractice: (title: string, description: string, minutes: number) => void;
  deleteCustomPractice: (id: string) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetAll: () => void;
  importState: (value: unknown) => boolean;
};

const StoreContext = createContext<StoreValue | null>(null);

export function SukunProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SukunState>(readState);
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
    document.documentElement.dataset.motion = state.settings.motion;
    document.documentElement.dataset.privacy = state.settings.privacyBlur ? "blur" : "clear";
  }, [state]);

  const toggleVerse = useCallback((id: string) => {
    setState((s) => ({ ...s, savedVerses: s.savedVerses.includes(id) ? s.savedVerses.filter((x) => x !== id) : [...s.savedVerses, id] }));
  }, []);

  const toggleArticle = useCallback((id: string) => {
    setState((s) => ({ ...s, savedArticles: s.savedArticles.includes(id) ? s.savedArticles.filter((x) => x !== id) : [...s.savedArticles, id] }));
  }, []);

  const saveReflection: StoreValue["saveReflection"] = useCallback((input) => {
    const id = input.id || uid("reflection");
    const now = new Date().toISOString();
    setState((s) => {
      const exists = s.reflections.some((entry) => entry.id === id);
      const next: ReflectionEntry = {
        id,
        createdAt: exists ? s.reflections.find((entry) => entry.id === id)!.createdAt : now,
        updatedAt: now,
        prompt: input.prompt.trim(),
        text: input.text.trim(),
        mood: input.mood,
      };
      return { ...s, reflections: exists ? s.reflections.map((entry) => (entry.id === id ? next : entry)) : [next, ...s.reflections] };
    });
    return id;
  }, []);

  const deleteReflection = useCallback((id: string) => {
    setState((s) => ({ ...s, reflections: s.reflections.filter((entry) => entry.id !== id) }));
  }, []);

  const saveGratitude = useCallback((date: string, items: [string, string, string]) => {
    setState((s) => ({ ...s, gratitude: { ...s.gratitude, [date]: { items, updatedAt: new Date().toISOString() } } }));
  }, []);

  const deleteGratitude = useCallback((date: string) => {
    setState((s) => {
      const gratitude = { ...s.gratitude };
      delete gratitude[date];
      return { ...s, gratitude };
    });
  }, []);

  const completeActivity: StoreValue["completeActivity"] = useCallback((input) => {
    setState((s) => {
      const existing = s.activities.find((a) => a.taskId === input.taskId && a.date === input.date);
      const activity: Activity = { ...input, id: existing?.id || uid("activity"), completedAt: new Date().toISOString() };
      return { ...s, activities: existing ? s.activities.map((a) => (a.id === existing.id ? activity : a)) : [activity, ...s.activities] };
    });
  }, []);

  const removeActivity = useCallback((id: string) => {
    setState((s) => ({ ...s, activities: s.activities.filter((a) => a.id !== id) }));
  }, []);

  const addGoal = useCallback((title: string, why: string) => {
    const goal: Goal = { id: uid("goal"), title: title.trim(), why: why.trim(), createdAt: new Date().toISOString(), checkins: [] };
    setState((s) => ({ ...s, goals: [goal, ...s.goals] }));
  }, []);

  const toggleGoalCheckin = useCallback((id: string, date: string) => {
    setState((s) => ({
      ...s,
      goals: s.goals.map((goal) => goal.id === id ? { ...goal, checkins: goal.checkins.includes(date) ? goal.checkins.filter((d) => d !== date) : [...goal.checkins, date] } : goal),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setState((s) => ({ ...s, goals: s.goals.filter((goal) => goal.id !== id) }));
  }, []);

  const addCustomPractice = useCallback((title: string, description: string, minutes: number) => {
    setState((s) => ({ ...s, customPractices: [{ id: uid("practice"), title: title.trim(), description: description.trim(), minutes }, ...s.customPractices] }));
  }, []);

  const deleteCustomPractice = useCallback((id: string) => {
    setState((s) => ({ ...s, customPractices: s.customPractices.filter((p) => p.id !== id), activities: s.activities.filter((a) => a.taskId !== id) }));
  }, []);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, []);

  const resetAll = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* storage can be unavailable */ }
    setState(freshState());
  }, []);

  const importState = useCallback((value: unknown) => {
    if (!value || typeof value !== "object" || (value as SukunState).version !== 1) return false;
    const candidate = value as Partial<SukunState>;
    if (!Array.isArray(candidate.reflections) || !Array.isArray(candidate.activities) || !candidate.gratitude || typeof candidate.gratitude !== "object" || Array.isArray(candidate.gratitude)) return false;
    setState(normalizeState(candidate));
    return true;
  }, []);

  const value = useMemo<StoreValue>(() => ({
    state, storageAvailable, toggleVerse, toggleArticle, saveReflection, deleteReflection,
    saveGratitude, deleteGratitude, completeActivity, removeActivity, addGoal,
    toggleGoalCheckin, deleteGoal, addCustomPractice, deleteCustomPractice,
    updateProfile, updateSettings, resetAll, importState,
  }), [state, storageAvailable, toggleVerse, toggleArticle, saveReflection, deleteReflection,
    saveGratitude, deleteGratitude, completeActivity, removeActivity, addGoal,
    toggleGoalCheckin, deleteGoal, addCustomPractice, deleteCustomPractice,
    updateProfile, updateSettings, resetAll, importState]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useSukun() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useSukun must be used inside SukunProvider");
  return value;
}
