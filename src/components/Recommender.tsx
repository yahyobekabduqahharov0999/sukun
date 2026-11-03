import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Bookmark, BookOpen, Brain, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { articles, practices, verses, type Article, type Practice, type Verse } from "../data/content";
import { Link } from "../lib/router";
import { useSukun } from "../lib/store";
import { Button, useToast } from "./UI";

type Result = { verse?: Verse; article?: Article; practice?: Practice; reason: string; notice?: string; crisis?: boolean };
type Message = { id: number; role: "user" | "guide"; text: string };
const moods = ["sokinlik", "tashvish", "shukr", "ilm", "maqsad", "sabr"];
const synonyms: Record<string, string[]> = {
  "xotirjam": ["sokinlik"], "sokin": ["sokinlik"], "tinch": ["sokinlik"], "tashvish": ["tashvish", "sokinlik"], "xavotir": ["tashvish"], "qo‘rq": ["tashvish", "sabr"], "qo'rq": ["tashvish", "sabr"], "xafa": ["sabr", "qiyinchilik"], "qiyin": ["qiyinchilik", "sabr", "umid"], "shukr": ["shukr", "ne'mat"], "minnat": ["shukr"], "o‘rgan": ["ilm"], "o'rgan": ["ilm"], "bilm": ["ilm"], "qur’on": ["qur'on", "ilm"], "qur'on": ["qur'on", "ilm"], "maqsad": ["maqsad", "rivojlanish"], "odat": ["odat", "rivojlanish"], "charcha": ["sokinlik", "diqqat"], "diqqat": ["diqqat"], "kechir": ["afv", "mehr"], "sabr": ["sabr"], "tavakkal": ["tavakkal"], "iymon": ["iymon"],
};

function themesFrom(text: string, mood: string) {
  const found = new Set<string>();
  if (mood) found.add(mood);
  const normalized = text.toLowerCase();
  Object.entries(synonyms).forEach(([word, tags]) => { if (normalized.includes(word)) tags.forEach((tag) => found.add(tag)); });
  return Array.from(found);
}

function rank<T extends { id: string; themes: string[] }>(items: T[], themes: string[], offset: number) {
  return items.map((item, index) => {
    const matches = item.themes.filter((theme) => themes.includes(theme));
    return { item, score: matches.length * 4 - ((index + offset) % items.length) * .015, matches };
  }).sort((a, b) => b.score - a.score)[0];
}

export default function Recommender() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "guide", text: "Hozirgi holatingiz yoki o‘rganmoqchi bo‘lgan mavzuingizni yozing. Men shu qurilmada mavjud SUKUN materiallaridan yo‘l taklif qilaman." }]);
  const [result, setResult] = useState<Result | null>(null);
  const [runs, setRuns] = useState(0);
  const { state, toggleVerse } = useSukun();
  const { toast } = useToast();
  const canSubmit = useMemo(() => text.trim().length > 2 || !!mood, [text, mood]);

  const recommend = () => {
    if (!canSubmit) return;
    const query = text.trim() || `Bugun ${mood} uchun yo‘l izlayapman`;
    const lower = query.toLowerCase();
    const userMessage: Message = { id: Date.now(), role: "user", text: query };
    const crisis = /o['‘`]zimni\s+(o['‘`]ldir|o‘ldir)|yashashni\s+xohlamayman|o['‘`]zimga\s+zarar/.test(lower);
    const ruling = /fatvo|halolmi|harommi|horommi|nikoh.*(haqida|qilish)|taloq|ajrashish.*(hukm|kerakmi)/.test(lower);
    if (crisis) {
      const notice = "Bunday og‘ir holatda shu yordamchi yetarli emas. Hozir xavf bo‘lsa, mahalliy favqulodda yordam xizmatiga murojaat qiling yoki yoningizdagi ishonchli insonni chaqiring. Yolg‘iz qolmang; malakali mutaxassis yordami ham muhim.";
      setMessages((m) => [...m, userMessage, { id: Date.now() + 1, role: "guide", text: notice }]);
      setResult({ reason: "Sizning xavfsizligingiz birinchi o‘rinda.", notice, crisis: true });
    } else if (ruling) {
      const article = articles.find((a) => a.id === "oyatni-kontekstda")!;
      const notice = "Bu savol aniq diniy hukm yoki shaxsiy vaziyat tahlilini talab qiladi. Men fatvo bera olmayman va o‘zimni diniy avtoritet deb hisoblamayman. Ishonchli, malakali ustozga murojaat qiling; hozircha manbani mas’uliyat bilan o‘qish bo‘yicha material taklif qilaman.";
      setMessages((m) => [...m, userMessage, { id: Date.now() + 1, role: "guide", text: notice }]);
      setResult({ article, reason: "Savolingizga to‘g‘ridan-to‘g‘ri hukm bermasdan, ishonchli o‘rganish chegarasini taklif qildim.", notice });
    } else {
      const themes = themesFrom(query, mood);
      const effectiveThemes = themes.length ? themes : ["tafakkur", "sokinlik", "ilm"];
      const verseRank = rank(verses, effectiveThemes, runs);
      const articleRank = rank(articles, effectiveThemes, runs + 2);
      const practiceRank = rank(practices, effectiveThemes, runs + 4);
      const names = Array.from(new Set([...verseRank.matches, ...articleRank.matches, ...practiceRank.matches]));
      const reason = names.length ? `So‘rovingizdagi ${names.slice(0, 3).join(", ")} mavzulariga moslik bo‘yicha tanlandi.` : "Aniq mavzu topilmagani uchun sokin kuzatuv va ilmga yo‘naltirilgan umumiy yo‘l tanlandi.";
      const response = "Sizga uch qismli yumshoq yo‘l tuzdim: bir oyat, bitta o‘qish va bitta kichik amaliyot. Bular tavsiya, diniy hukm yoki tashxis emas.";
      setMessages((m) => [...m, userMessage, { id: Date.now() + 1, role: "guide", text: response }]);
      setResult({ verse: verseRank.item, article: articleRank.item, practice: practiceRank.item, reason });
    }
    setRuns((n) => n + 1);
    setText("");
  };

  return (
    <div className="recommender-shell">
      <div className="guide-status"><span className="status-orb"><Brain size={17} /></span><div><strong>SUKUN yo‘riqchisi</strong><small>Mahalliy qoidalar · serverga yuborilmaydi</small></div><span className="online-dot" /></div>
      <div className="guide-conversation" aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.slice(-5).map((message) => <motion.div key={message.id} className={`guide-message ${message.role}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><span>{message.role === "guide" ? "S" : "Siz"}</span><p>{message.text}</p></motion.div>)}
        </AnimatePresence>
      </div>
      <div className="mood-row" aria-label="Holatni tanlash">{moods.map((item) => <button key={item} className={mood === item ? "active" : ""} onClick={() => setMood(mood === item ? "" : item)} aria-pressed={mood === item}>{item}</button>)}</div>
      <form className="guide-input" onSubmit={(e) => { e.preventDefault(); recommend(); }}>
        <label htmlFor="guide-query" className="sr-only">Holatingizni yozing</label>
        <textarea id="guide-query" value={text} onChange={(e) => setText(e.target.value)} placeholder="Masalan: Bugun xavotirdaman, qalbimni tinchlantirmoqchiman…" rows={2} maxLength={400} />
        <Button type="submit" disabled={!canSubmit} icon={<ArrowUpRight size={17} />}>Yo‘l tuzish</Button>
      </form>
      <p className="guide-disclaimer">Sun’iy intellekt API’si ulanmagan. Tavsiyalar kalit so‘zlar asosida, faqat shu sahifadagi tekshirilgan manbali kontentdan tanlanadi. Ruhiy yoki diniy tashxis qo‘yilmaydi.</p>
      <AnimatePresence mode="wait">
        {result && (
          <motion.div className="recommendation-result" key={`${runs}-${result.verse?.id || result.article?.id || "notice"}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .55 }}>
            <div className="result-reason"><Sparkles size={16} /><p>{result.reason}</p></div>
            {result.verse && <div className="result-verse"><div className="result-label">01 · {result.verse.excerpt ? "OYATDAN PARCHA" : "OYAT"}</div><p lang="ar" dir="rtl">{result.verse.arabic}</p><blockquote>{result.verse.translation}</blockquote><div><Link to="/quron">{result.verse.surahName}, {result.verse.surah}:{result.verse.ayah} <ArrowUpRight size={13} /></Link><button onClick={() => { toggleVerse(result.verse!.id); toast(state.savedVerses.includes(result.verse!.id) ? "Oyat olib tashlandi" : "Oyat saqlandi"); }}><Bookmark size={14} />{state.savedVerses.includes(result.verse.id) ? "Saqlandi" : "Saqlash"}</button></div></div>}
            {result.article && <Link className="result-row" to={`/ilm?article=${result.article.id}`}><BookOpen size={18} /><div><span>02 · O‘QISH</span><strong>{result.article.title}</strong><small>{result.article.minutes} daqiqa · {result.article.category}</small></div><ArrowUpRight size={18} /></Link>}
            {result.practice && <Link className="result-row" to="/rivojlanish"><Sparkles size={18} /><div><span>03 · AMALIYOT</span><strong>{result.practice.title}</strong><small>{result.practice.minutes} daqiqa · {result.practice.category}</small></div><ArrowUpRight size={18} /></Link>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
