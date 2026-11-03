import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, Copy, Eye, EyeOff, PenLine, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "../components/Layout";
import { Button, copyText, EmptyState, IconButton, Modal, Reveal, SectionHeading, useToast } from "../components/UI";
import { getDailyPrompt, reflectionPrompts } from "../data/content";
import { useRouter } from "../lib/router";
import { formatUzDate, useSukun, type ReflectionEntry } from "../lib/store";

const moods = ["Xotirjam", "Minnatdor", "Tafakkurda", "Tashvishli", "Xafa", "Umidli"];

export default function Reflection() {
  const { search } = useRouter();
  const daily = getDailyPrompt();
  const { state, saveReflection, deleteReflection, updateSettings } = useSukun();
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [prompt, setPrompt] = useState(search.get("prompt") || daily.text);
  const [text, setText] = useState("");
  const [mood, setMood] = useState("Xotirjam");
  const [query, setQuery] = useState("");
  const [reading, setReading] = useState<ReflectionEntry | null>(null);
  const [deleting, setDeleting] = useState<ReflectionEntry | null>(null);

  useEffect(() => { const incoming = search.get("prompt"); if (incoming) setPrompt(incoming); }, [search]);
  const filtered = useMemo(() => state.reflections.filter((entry) => `${entry.prompt} ${entry.text} ${entry.mood}`.toLowerCase().includes(query.toLowerCase())), [state.reflections, query]);
  const monthCount = state.reflections.filter((entry) => { const d = new Date(entry.createdAt); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length;
  const reset = () => { setEditingId(undefined); setText(""); setMood("Xotirjam"); setPrompt(daily.text); };
  const save = () => {
    if (text.trim().length < 3) { toast("Yozuvni saqlash uchun kamida bir necha so‘z kiriting.", "info"); return; }
    saveReflection({ id: editingId, prompt, text, mood });
    toast(editingId ? "Yozuv yangilandi" : "Tafakkur kundalikka saqlandi");
    reset();
  };
  const edit = (entry: ReflectionEntry) => {
    setEditingId(entry.id); setPrompt(entry.prompt); setText(entry.text); setMood(entry.mood); setReading(null);
    window.setTimeout(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };
  const copyEntry = async (entry: ReflectionEntry) => {
    try { await copyText(`${entry.prompt}\n\n${entry.text}\n\n${formatUzDate(entry.createdAt)} · ${entry.mood}`); toast("Yozuv nusxalandi"); }
    catch { toast("Nusxalash imkoni bo‘lmadi", "info"); }
  };
  return (
    <>
      <PageHeader eyebrow="TAFAKKUR · SHAXSIY KUNDALIK" title="Bir lahza to‘xtang. O‘zingizni tinglang." description="Savol sizni bir joyga yetaklashi shart emas. Ba’zan shunchaki yozish ham ichki makonni kengaytiradi.">
        <div className="page-header-actions"><Button variant="secondary" onClick={() => editorRef.current?.scrollIntoView({ behavior: "smooth" })} icon={<ArrowDown size={16} />}>Yozuvni boshlash</Button><span>{state.reflections.length} ta shaxsiy yozuv</span></div>
      </PageHeader>
      <section className="section reflection-main"><div className="container">
        <div className="reflection-stats"><div><strong>{state.reflections.length}</strong><span>Jami yozuv</span></div><div><strong>{monthCount}</strong><span>Shu oyda</span></div><button onClick={() => updateSettings({ privacyBlur: !state.settings.privacyBlur })}>{state.settings.privacyBlur ? <Eye size={18} /> : <EyeOff size={18} />}<span>{state.settings.privacyBlur ? "Yozuvlarni ko‘rsatish" : "Maxfiy ko‘rinish"}</span></button></div>
        <div className="reflection-layout">
          <div className="reflection-editor" ref={editorRef}>
            <div className="editor-heading"><span>{editingId ? "YOZUVNI TAHRIRLASH" : "BUGUNGI YOZUV"}</span>{editingId && <button onClick={reset}>Yangi yozuv</button>}</div>
            <label htmlFor="reflection-prompt">Savol yoki mavzu</label><input id="reflection-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} maxLength={300} />
            <div className="prompt-chip-list">{reflectionPrompts.slice(0, 6).map((item) => <button key={item.id} className={prompt === item.text ? "active" : ""} onClick={() => setPrompt(item.text)}>{item.text}</button>)}</div>
            <label htmlFor="reflection-text">Fikrlaringiz</label><textarea id="reflection-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Hozir qalbingizdan nima o‘tyapti?.." rows={11} maxLength={10000} />
            <div className="editor-options"><label>Kayfiyat<select value={mood} onChange={(e) => setMood(e.target.value)}>{moods.map((item) => <option key={item}>{item}</option>)}</select></label><span>{text.length} / 10000</span></div>
            <Button onClick={save} icon={<ArrowRight size={16} />}>{editingId ? "O‘zgarishni saqlash" : "Shaxsiy kundalikka saqlash"}</Button>
            <p className="local-warning">Yozuvlar shu brauzerning localStorage xotirasida saqlanadi; bu shifrlangan hisob emas. Umumiy qurilmada maxfiy ko‘rinishdan foydalaning va zarur bo‘lsa ma’lumotlarni o‘chiring.</p>
          </div>
          <div className="reflection-history">
            <div className="history-heading"><div><span>YOZUVLAR TARIXI</span><h2>O‘tmishdagi ovozingiz.</h2></div><PenLine size={21} /></div>
            <div className="search-field"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Yozuvlardan qidirish…" aria-label="Tafakkur yozuvlarini qidirish" /></div>
            <div className="reflection-entry-list"><AnimatePresence initial={false}>{filtered.map((entry) => <motion.article layout key={entry.id} className="reflection-entry" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}><div className="entry-meta"><span>{formatUzDate(entry.createdAt)}</span><i>{entry.mood}</i></div><h3 className="private-text">{entry.prompt}</h3><p className="private-text">{entry.text}</p><div className="entry-actions"><button onClick={() => setReading(entry)}>O‘qish <ArrowRight size={14} /></button><button onClick={() => edit(entry)}>Tahrirlash</button><IconButton label="Yozuvni nusxalash" onClick={() => copyEntry(entry)}><Copy size={15} /></IconButton><IconButton label="Yozuvni o‘chirish" onClick={() => setDeleting(entry)}><Trash2 size={15} /></IconButton></div></motion.article>)}</AnimatePresence></div>
            {!filtered.length && <EmptyState title={state.reflections.length ? "Qidiruvda yozuv topilmadi" : "Birinchi yozuvingiz shu yerda"} text={state.reflections.length ? "Boshqa kalit so‘zni sinab ko‘ring." : "Yon tomondagi savoldan boshlab, o‘zingizga bir necha daqiqa bering."} />}
          </div>
        </div>
      </div></section>
      <section className="section prompt-library"><div className="container"><SectionHeading eyebrow="SAVOLLAR TO‘PLAMI" title="Ichki suhbat uchun o‘n ikki eshik." text="Bugun bittasini tanlang. Javob yozish shart bo‘lmasa, savolni shunchaki o‘zingiz bilan olib yuring." /><div className="prompt-grid">{reflectionPrompts.map((item, index) => <Reveal key={item.id} delay={(index % 4) * .05}><button onClick={() => { setPrompt(item.text); setEditingId(undefined); editorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}><span>{String(index + 1).padStart(2, "0")}</span><p>{item.text}</p><ArrowRight size={16} /></button></Reveal>)}</div></div></section>
      <Modal open={!!reading} onClose={() => setReading(null)} title={reading ? formatUzDate(reading.createdAt) : "Yozuv"}>{reading && <div className="reflection-reading"><span>{reading.mood}</span><h3 className="private-text">{reading.prompt}</h3><p className="private-text">{reading.text}</p><div><Button variant="secondary" onClick={() => edit(reading)}>Tahrirlash</Button><Button variant="ghost" onClick={() => copyEntry(reading)} icon={<Copy size={15} />}>Nusxalash</Button></div></div>}</Modal>
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Yozuvni o‘chirasizmi?">{deleting && <div className="confirm-dialog"><p>“{deleting.prompt}” mavzusidagi yozuv butunlay o‘chadi. Bu amalni ortga qaytarib bo‘lmaydi.</p><div><Button variant="secondary" onClick={() => setDeleting(null)}>Bekor qilish</Button><Button onClick={() => { deleteReflection(deleting.id); setDeleting(null); if (reading?.id === deleting.id) setReading(null); toast("Yozuv o‘chirildi", "info"); }}>O‘chirish</Button></div></div>}</Modal>
    </>
  );
}
