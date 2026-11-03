import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/Layout";
import { Button, EmptyState, Modal, Reveal, SectionHeading, useToast } from "../components/UI";
import { fromDateKey, formatUzDate, toDateKey, useSukun } from "../lib/store";

const placeholders = ["Bugun nima sizga yengillik berdi?", "Kimning mehrini yoki yordamini his qildingiz?", "Qaysi oddiy ne’matni payqadingiz?"];
const weekdays = ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"];

function gratitudeStreak(keys: string[]) {
  const dates = new Set(keys);
  const cursor = new Date();
  if (!dates.has(toDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (dates.has(toDateKey(cursor))) { count++; cursor.setDate(cursor.getDate() - 1); }
  return count;
}

export default function Gratitude() {
  const { state, saveGratitude, deleteGratitude } = useSukun();
  const { toast } = useToast();
  const today = toDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [items, setItems] = useState<[string, string, string]>(["", "", ""]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const existing = state.gratitude[selectedDate];
  const isFuture = selectedDate > today;
  useEffect(() => { const value = state.gratitude[selectedDate]?.items; setItems(value ? [value[0], value[1], value[2]] : ["", "", ""]); }, [selectedDate, state.gratitude]);
  const dates = useMemo(() => Object.keys(state.gratitude).sort().reverse(), [state.gratitude]);
  const streak = gratitudeStreak(dates);
  const firstOffset = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const monthLabel = new Intl.DateTimeFormat("uz-UZ", { month: "long", year: "numeric" }).format(month);
  const nextDisabled = new Date(month.getFullYear(), month.getMonth() + 1, 1) > new Date();
  const selectDay = (day: number) => {
    const key = toDateKey(new Date(month.getFullYear(), month.getMonth(), day));
    if (key > today) { toast("Kelajak sanasiga hali yozuv qo‘shib bo‘lmaydi.", "info"); return; }
    setSelectedDate(key);
  };
  const update = (index: number, value: string) => setItems((old) => old.map((item, i) => i === index ? value : item) as [string, string, string]);
  const save = () => {
    if (isFuture) return;
    if (items.some((item) => !item.trim())) { toast("Uchala maydonga ham bir ne’matni yozing.", "info"); return; }
    saveGratitude(selectedDate, items.map((item) => item.trim()) as [string, string, string]);
    toast(`${formatUzDate(selectedDate)} uchun shukronalik saqlandi`);
  };
  return (
    <>
      <PageHeader eyebrow="SHUKRONALIK · KUNDALIK AMALIYOT" title="Shukr bilan yashash." description="Har kuni uchta aniq ne’mat. Uzun yozuv shart emas; samimiy va kichik detal kifoya.">
        <div className="page-header-actions"><Button variant="secondary" onClick={() => document.getElementById("gratitude-editor")?.scrollIntoView({ behavior: "smooth" })} icon={<Sparkles size={16} />}>Bugungi uch ne’mat</Button><span>{dates.length} kunlik tarix</span></div>
      </PageHeader>
      <section className="gratitude-summary"><div className="container"><Reveal><div><strong>{dates.length}</strong><span>Yozuvlangan kun</span></div></Reveal><Reveal delay={.06}><div><strong>{dates.length * 3}</strong><span>Nomlangan ne’mat</span></div></Reveal><Reveal delay={.12}><div><strong>{streak}</strong><span>Ketma-ket kun</span></div></Reveal><Reveal delay={.18}><p>Bo‘sh kunlar hisobingizni buzmaydi. Kundalik bosim uchun emas, qaytish uchun ochiq.</p></Reveal></div></section>
      <section className="section gratitude-workspace"><div className="container gratitude-layout">
        <div className="gratitude-editor" id="gratitude-editor"><div className="editor-heading"><span>{selectedDate === today ? "BUGUNGI UCH NE’MAT" : formatUzDate(selectedDate).toUpperCase()}</span>{selectedDate !== today && <button onClick={() => setSelectedDate(today)}>Bugunga qaytish</button>}</div><h2>{existing ? "Bugungi ne’matlaringiz." : "Nima uchun shukr qilasiz?"}</h2><p>Har bir javobni aniq qiling: “oilam” o‘rniga “onam bilan qilgan qisqa suhbatim”.</p>{items.map((item, index) => <label key={index}><span>0{index + 1}</span><div><small>{["YENGILLIK", "MEHR", "ODDIY NE’MAT"][index]}</small><textarea value={item} onChange={(e) => update(index, e.target.value)} placeholder={placeholders[index]} rows={2} maxLength={400} disabled={isFuture} /></div><i>{item.length}/400</i></label>)}<Button onClick={save} disabled={isFuture} icon={<ArrowRight size={16} />}>{existing ? "O‘zgarishni saqlash" : "Shukronalikni saqlash"}</Button>{existing && <button className="delete-text-button" onClick={() => setConfirmDelete(true)}><Trash2 size={14} />Bu kun yozuvini o‘chirish</button>}<p className="local-warning">Shukronalik tarixi shu brauzerda saqlanadi. SUKUN serveriga yuborilmaydi, lekin localStorage shifrlangan xavfsiz hisob emas.</p></div>
        <div className="gratitude-calendar"><div className="calendar-head"><div><span>KALENDAR</span><h2>{monthLabel}</h2></div><div><button aria-label="Oldingi oy" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={18} /></button><button aria-label="Keyingi oy" disabled={nextDisabled} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={18} /></button></div></div><div className="calendar-weekdays">{weekdays.map((day) => <span key={day}>{day}</span>)}</div><motion.div className="calendar-grid" key={monthLabel} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>{Array.from({ length: firstOffset }, (_, i) => <span className="calendar-blank" key={`blank-${i}`} />)}{Array.from({ length: daysInMonth }, (_, i) => { const day = i + 1; const key = toDateKey(new Date(month.getFullYear(), month.getMonth(), day)); const filled = !!state.gratitude[key]; return <button key={key} className={`${selectedDate === key ? "selected" : ""} ${filled ? "filled" : ""} ${key === today ? "today" : ""} ${key > today ? "future" : ""}`} onClick={() => selectDay(day)} aria-label={`${formatUzDate(key)}${filled ? ", yozuv bor" : ""}`}><span>{day}</span>{filled && <i><Check size={10} /></i>}</button>; })}</motion.div><div className="calendar-legend"><span><i className="filled" />Yozuv bor</span><span><i className="today" />Bugun</span></div><div className="calendar-selected"><span>TANLANGAN KUN</span><p>{formatUzDate(selectedDate)}</p><small>{existing ? "Uchta ne’mat saqlangan" : isFuture ? "Bu kun hali kelmagan" : "Hali yozuv yo‘q"}</small></div></div>
      </div></section>
      <section className="section gratitude-history"><div className="container"><SectionHeading eyebrow="SHAXSIY TARIX" title="Ne’matlaringizga qaytish." text="Sanani tanlang — yozuvlar yuqoridagi kundalikda ochiladi va tahrirlanadi." /><div className="gratitude-history-list"><AnimatePresence initial={false}>{dates.map((date) => <motion.button layout key={date} onClick={() => { setSelectedDate(date); const d = fromDateKey(date); setMonth(new Date(d.getFullYear(), d.getMonth(), 1)); document.getElementById("gratitude-editor")?.scrollIntoView({ behavior: "smooth" }); }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><div><span>{formatUzDate(date)}</span><small>{date === today ? "Bugun" : "3 ne’mat"}</small></div><ol className="private-text">{state.gratitude[date].items.map((item, i) => <li key={i}>{item}</li>)}</ol><ArrowLeft size={17} /></motion.button>)}</AnimatePresence></div>{!dates.length && <EmptyState title="Shukronalik tarixi hozircha bo‘sh" text="Bugungi uchta kichik ne’matni yozsangiz, birinchi sahifa shu yerda paydo bo‘ladi." />}</div></section>
      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Kun yozuvini o‘chirasizmi?"><div className="confirm-dialog"><p>{formatUzDate(selectedDate)} sanasidagi uchala shukronalik yozuvi o‘chadi. Bu amalni ortga qaytarib bo‘lmaydi.</p><div><Button variant="secondary" onClick={() => setConfirmDelete(false)}>Bekor qilish</Button><Button onClick={() => { deleteGratitude(selectedDate); setConfirmDelete(false); toast("Kun yozuvi o‘chirildi", "info"); }}>O‘chirish</Button></div></div></Modal>
    </>
  );
}
