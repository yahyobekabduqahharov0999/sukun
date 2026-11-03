import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, Clock, Plus, Target, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "../components/Layout";
import { Button, EmptyState, IconButton, Modal, Reveal, SectionHeading, useToast } from "../components/UI";
import { practices } from "../data/content";
import { formatUzDate, toDateKey, useSukun } from "../lib/store";

type DisplayPractice = { id: string; title: string; description: string; minutes: number; category: string; custom?: boolean };

function dateRange(count: number, end = new Date()) {
  return Array.from({ length: count }, (_, index) => { const d = new Date(end); d.setDate(d.getDate() - (count - 1 - index)); return toDateKey(d); });
}

function ProgressChart({ activities, metric }: { activities: ReturnType<typeof useSukun>["state"]["activities"]; metric: "count" | "minutes" }) {
  const days = dateRange(14);
  const values = days.map((day) => metric === "count" ? activities.filter((a) => a.date === day).length : activities.filter((a) => a.date === day).reduce((sum, a) => sum + a.minutes, 0));
  const max = Math.max(metric === "count" ? 3 : 20, ...values);
  const points = values.map((value, index) => ({ x: 26 + index * (668 / 13), y: 178 - (value / max) * 140, value, day: days[index] }));
  const line = points.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
  const area = `${line} L${points[points.length - 1].x},178 L${points[0].x},178 Z`;
  return <div className="progress-chart"><svg viewBox="0 0 720 220" role="img" aria-label={`So‘nggi 14 kun: ${values.reduce((a, b) => a + b, 0)} ${metric === "count" ? "qadam" : "daqiqa"}`}><defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c6a66b" stopOpacity=".28" /><stop offset="1" stopColor="#c6a66b" stopOpacity="0" /></linearGradient></defs>{[38, 85, 131, 178].map((y) => <line key={y} x1="24" y1={y} x2="696" y2={y} className="chart-gridline" />)}<motion.path d={area} fill="url(#chart-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} /><motion.path d={line} className="chart-line" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />{points.map((point, index) => <g key={point.day}><circle cx={point.x} cy={point.y} r={point.value ? 4 : 2.2} className={point.value ? "chart-dot active" : "chart-dot"}><title>{formatUzDate(point.day)}: {point.value} {metric === "count" ? "qadam" : "daqiqa"}</title></circle>{index % 2 === 1 && <text x={point.x} y="204" textAnchor="middle" className="chart-label">{new Date(`${point.day}T12:00:00`).getDate()}</text>}</g>)}</svg></div>;
}

export default function Growth() {
  const { state, completeActivity, removeActivity, addGoal, toggleGoalCheckin, deleteGoal, addCustomPractice, deleteCustomPractice } = useSukun();
  const { toast } = useToast();
  const today = toDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [category, setCategory] = useState("Barchasi");
  const [selectedPractice, setSelectedPractice] = useState<DisplayPractice | null>(null);
  const [note, setNote] = useState("");
  const [metric, setMetric] = useState<"count" | "minutes">("count");
  const [goalOpen, setGoalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalWhy, setGoalWhy] = useState("");
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [practiceTitle, setPracticeTitle] = useState("");
  const [practiceDescription, setPracticeDescription] = useState("");
  const [practiceMinutes, setPracticeMinutes] = useState(5);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "goal" | "practice"; id: string; title: string } | null>(null);
  const allPractices = useMemo<DisplayPractice[]>(() => [...practices, ...state.customPractices.map((p) => ({ ...p, category: "Shaxsiy", custom: true }))], [state.customPractices]);
  const categories = ["Barchasi", ...Array.from(new Set(allPractices.map((p) => p.category)))];
  const visiblePractices = allPractices.filter((p) => category === "Barchasi" || p.category === category);
  const selectedActivities = state.activities.filter((a) => a.date === selectedDate);
  const allDates = dateRange(7);
  const openPractice = (practice: DisplayPractice) => { setSelectedPractice(practice); setNote(state.activities.find((a) => a.taskId === practice.id && a.date === selectedDate)?.note || ""); };
  const togglePractice = (practice: DisplayPractice) => {
    const activity = state.activities.find((a) => a.taskId === practice.id && a.date === selectedDate);
    if (activity) { removeActivity(activity.id); toast("Amaliyot belgisi olindi", "info"); }
    else openPractice(practice);
  };
  const saveActivity = () => {
    if (!selectedPractice) return;
    completeActivity({ taskId: selectedPractice.id, title: selectedPractice.title, date: selectedDate, note: note.trim(), minutes: selectedPractice.minutes });
    toast("Qadam va izohingiz saqlandi"); setSelectedPractice(null); setNote("");
  };
  const submitGoal = () => {
    if (goalTitle.trim().length < 3) { toast("Maqsad nomini aniqroq yozing.", "info"); return; }
    addGoal(goalTitle, goalWhy); setGoalTitle(""); setGoalWhy(""); setGoalOpen(false); toast("Yangi maqsad yaratildi");
  };
  const submitPractice = () => {
    if (practiceTitle.trim().length < 3) { toast("Amaliyot nomini yozing.", "info"); return; }
    addCustomPractice(practiceTitle, practiceDescription, practiceMinutes); setPracticeTitle(""); setPracticeDescription(""); setPracticeMinutes(5); setPracticeOpen(false); toast("Shaxsiy amaliyot qo‘shildi");
  };
  const activityStreak = (() => { const set = new Set(state.activities.map((a) => a.date)); const d = new Date(); if (!set.has(toDateKey(d))) d.setDate(d.getDate() - 1); let n = 0; while (set.has(toDateKey(d))) { n++; d.setDate(d.getDate() - 1); } return n; })();
  return (
    <>
      <PageHeader eyebrow="RIVOJLANISH · YUMSHOQ DAVOMIYLIK" title="Har kuni bir qadam." description="O‘zingizni boshqa biri bilan solishtirmang. Kichik amaliyot, samimiy izoh va o‘zingizga mos maqsad kifoya.">
        <div className="page-header-actions"><Button onClick={() => setGoalOpen(true)} icon={<Plus size={16} />}>Shaxsiy maqsad</Button><span>{activityStreak} kunlik davomiylik</span></div>
      </PageHeader>
      <section className="growth-dashboard section"><div className="container">
        <div className="date-ribbon">{allDates.map((date) => { const d = new Date(`${date}T12:00:00`); const count = state.activities.filter((a) => a.date === date).length; return <button key={date} className={selectedDate === date ? "active" : ""} onClick={() => setSelectedDate(date)}><span>{new Intl.DateTimeFormat("uz-UZ", { weekday: "short" }).format(d)}</span><strong>{d.getDate()}</strong><i>{count ? `${count} qadam` : date === today ? "Bugun" : "—"}</i></button>; })}</div>
        <div className="growth-overview"><div className="daily-progress-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="51" /><motion.circle cx="60" cy="60" r="51" className="progress-value" strokeDasharray="320.44" animate={{ strokeDashoffset: 320.44 * (1 - selectedActivities.length / Math.max(allPractices.length, 1)) }} /></svg><div><strong>{selectedActivities.length}<span>/{allPractices.length}</span></strong><small>qadam</small></div></div><div><span>{formatUzDate(selectedDate)}</span><h2>{selectedDate === today ? "Bugun o‘zingizga mos qadamni tanlang." : "Bu kundagi qadamlaringiz."}</h2><p>Hammasini bajarish shart emas. Bitta samimiy amaliyot ham mazmunli.</p></div><Button variant="secondary" onClick={() => setPracticeOpen(true)} icon={<Plus size={16} />}>O‘z amaliyotingiz</Button></div>
        <div className="practice-section"><div className="practice-filter"><span>KUNDALIK AMALIYOTLAR</span><div className="filter-scroll">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></div><motion.div layout className="practice-list"><AnimatePresence mode="popLayout">{visiblePractices.map((practice) => { const activity = selectedActivities.find((a) => a.taskId === practice.id); return <motion.article layout key={practice.id} className={`practice-item ${activity ? "done" : ""}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .97 }}><button className="practice-check" onClick={() => togglePractice(practice)} aria-pressed={!!activity} aria-label={activity ? "Belgini olish" : "Bajarildi deb belgilash"}>{activity ? <Check size={18} /> : <Plus size={18} />}</button><div className="practice-item-copy"><span>{practice.category} · <Clock size={12} /> {practice.minutes} daqiqa</span><h3>{practice.title}</h3><p>{practice.description || "Siz yaratgan shaxsiy kundalik amaliyot."}</p>{activity?.note && <blockquote className="private-text">“{activity.note}”</blockquote>}</div><div className="practice-item-actions"><button onClick={() => openPractice(practice)}>{activity ? "Izohni tahrirlash" : "Izoh bilan belgilash"}<ChevronRight size={15} /></button>{practice.custom && <IconButton label="Amaliyotni o‘chirish" onClick={() => setDeleteTarget({ type: "practice", id: practice.id, title: practice.title })}><Trash2 size={15} /></IconButton>}</div></motion.article>; })}</AnimatePresence></motion.div></div>
      </div></section>
      <section className="section progress-history"><div className="container"><div className="section-split-heading"><SectionHeading eyebrow="PROGRESS TARIXI" title="O‘sishni bosimsiz kuzating." text="Grafik faqat siz saqlagan qadamlar va daqiqalarni ko‘rsatadi. Nol ham haqiqiy, xotirjam kun." /><Reveal><div className="metric-toggle"><button className={metric === "count" ? "active" : ""} onClick={() => setMetric("count")}>Qadamlar</button><button className={metric === "minutes" ? "active" : ""} onClick={() => setMetric("minutes")}>Daqiqalar</button></div></Reveal></div><Reveal className="large-chart" direction="scale"><div className="chart-summary"><div><strong>{state.activities.filter((a) => dateRange(14).includes(a.date)).length}</strong><span>14 kundagi qadam</span></div><div><strong>{state.activities.filter((a) => dateRange(14).includes(a.date)).reduce((sum, a) => sum + a.minutes, 0)}</strong><span>Belgilangan daqiqa</span></div><div><strong>{state.activities.filter((a) => a.note).length}</strong><span>Izohli yozuv</span></div></div><ProgressChart activities={state.activities} metric={metric} /></Reveal>
          <div className="activity-history"><div className="history-heading"><div><span>BAJARILGAN FAOLIYATLAR</span><h2>Qadamlar va izohlar.</h2></div></div>{state.activities.length ? <div>{state.activities.slice().sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 20).map((activity) => <article key={activity.id}><span>{formatUzDate(activity.date)}</span><div><h3>{activity.title}</h3>{activity.note ? <p className="private-text">{activity.note}</p> : <p className="muted">Izoh yozilmagan</p>}</div><small>{activity.minutes} daq.</small><IconButton label="Faoliyatni o‘chirish" onClick={() => { removeActivity(activity.id); toast("Faoliyat tarixdan o‘chirildi", "info"); }}><X size={15} /></IconButton></article>)}</div> : <EmptyState title="Hali bajarilgan qadam yo‘q" text="Yuqoridagi amaliyotlardan birini tanlang. Tarix aynan shu yerda shakllanadi." />}</div>
        </div></section>
      <section className="section goals-section"><div className="container"><div className="section-split-heading"><SectionHeading eyebrow="SHAXSIY MAQSADLAR" title="Nima siz uchun muhim?" text="Maqsadning sababini ham yozing. Kunlik belgi — o‘z va’dangizga qaytishning kichik usuli." /><Reveal><Button variant="secondary" onClick={() => setGoalOpen(true)} icon={<Plus size={16} />}>Maqsad qo‘shish</Button></Reveal></div><div className="goal-list"><AnimatePresence>{state.goals.map((goal) => { const checked = goal.checkins.includes(today); return <motion.article layout key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}><div className="goal-symbol"><Target size={22} /></div><div><span>{formatUzDate(goal.createdAt)} dan</span><h3>{goal.title}</h3><p className="private-text">{goal.why || "Sabab hali yozilmagan."}</p></div><div className="goal-checkins"><strong>{goal.checkins.length}</strong><span>kunlik qaytish</span></div><button className={checked ? "checked" : ""} onClick={() => { toggleGoalCheckin(goal.id, today); toast(checked ? "Bugungi maqsad belgisi olindi" : "Maqsadga qaytish belgilandi"); }}>{checked ? <Check size={16} /> : <Plus size={16} />}{checked ? "Bugun belgilandi" : "Bugun belgilash"}</button><IconButton label="Maqsadni o‘chirish" onClick={() => setDeleteTarget({ type: "goal", id: goal.id, title: goal.title })}><Trash2 size={15} /></IconButton></motion.article>; })}</AnimatePresence></div>{!state.goals.length && <EmptyState title="Maqsadingiz uchun ochiq joy" text="Katta rejalar ro‘yxati emas, hozir hayotingizda muhim bo‘lgan bitta yo‘nalishdan boshlang." action={<Button onClick={() => setGoalOpen(true)} icon={<Plus size={16} />}>Birinchi maqsad</Button>} />}</div></section>
      <Modal open={!!selectedPractice} onClose={() => setSelectedPractice(null)} title={selectedPractice?.title || "Amaliyot"}>{selectedPractice && <div className="completion-dialog"><span>{formatUzDate(selectedDate)} · {selectedPractice.minutes} daqiqa</span><p>{selectedPractice.description}</p><label htmlFor="completion-note">Bu qadam sizda qanday iz qoldirdi? <small>Ixtiyoriy</small></label><textarea id="completion-note" value={note} onChange={(e) => setNote(e.target.value)} rows={5} maxLength={2000} placeholder="Qisqa, shaxsiy izoh…" /><Button onClick={saveActivity} icon={<Check size={16} />}>Qadamni saqlash</Button></div>}</Modal>
      <Modal open={goalOpen} onClose={() => setGoalOpen(false)} title="Yangi shaxsiy maqsad"><div className="form-stack"><label>Maqsad nomi<input value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder="Masalan: har kuni 10 daqiqa chuqur o‘qish" maxLength={160} /></label><label>Nima uchun bu muhim?<textarea value={goalWhy} onChange={(e) => setGoalWhy(e.target.value)} placeholder="Bu maqsad mening qaysi qadriyatimga xizmat qiladi?" rows={4} maxLength={600} /></label><Button onClick={submitGoal} icon={<ArrowRight size={16} />}>Maqsadni saqlash</Button></div></Modal>
      <Modal open={practiceOpen} onClose={() => setPracticeOpen(false)} title="O‘z amaliyotingizni yarating"><div className="form-stack"><label>Amaliyot nomi<input value={practiceTitle} onChange={(e) => setPracticeTitle(e.target.value)} placeholder="Masalan: ota-onamga qo‘ng‘iroq qilish" maxLength={140} /></label><label>Qisqa yo‘riqnoma<textarea value={practiceDescription} onChange={(e) => setPracticeDescription(e.target.value)} placeholder="Qanday bajarishni xohlaysiz?" rows={3} maxLength={600} /></label><label>Taxminiy vaqt (daqiqa)<input type="number" min="1" max="180" value={practiceMinutes} onChange={(e) => setPracticeMinutes(Math.max(1, Math.min(180, Number(e.target.value))))} /></label><Button onClick={submitPractice} icon={<Plus size={16} />}>Amaliyotni qo‘shish</Button></div></Modal>
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="O‘chirishni tasdiqlang">{deleteTarget && <div className="confirm-dialog"><p>“{deleteTarget.title}” o‘chadi. {deleteTarget.type === "practice" ? "Unga tegishli faoliyat tarixi ham o‘chadi." : "Kunlik qaytishlar tarixi ham o‘chadi."}</p><div><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Bekor qilish</Button><Button onClick={() => { if (deleteTarget.type === "goal") deleteGoal(deleteTarget.id); else deleteCustomPractice(deleteTarget.id); setDeleteTarget(null); toast("O‘chirildi", "info"); }}>O‘chirish</Button></div></div>}</Modal>
    </>
  );
}
