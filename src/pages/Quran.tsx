import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "../components/Layout";
import { Button, EmptyState, Modal, Reveal, SectionHeading } from "../components/UI";
import VerseCard from "../components/VerseCard";
import { getDailyVerse, verses, type Verse } from "../data/content";
import { Link } from "../lib/router";
import { formatUzDate, useSukun } from "../lib/store";

export default function Quran() {
  const daily = getDailyVerse();
  const { state } = useSukun();
  const [theme, setTheme] = useState("Barchasi");
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [reading, setReading] = useState<Verse | null>(null);
  const themes = ["Barchasi", ...Array.from(new Set(verses.flatMap((v) => v.themes))).sort()];
  const filtered = useMemo(() => verses.filter((verse) => {
    const themeMatch = theme === "Barchasi" || verse.themes.includes(theme);
    const savedMatch = !savedOnly || state.savedVerses.includes(verse.id);
    const haystack = `${verse.surahName} ${verse.translation} ${verse.themes.join(" ")}`.toLowerCase();
    return themeMatch && savedMatch && haystack.includes(query.toLowerCase().trim());
  }), [theme, query, savedOnly, state.savedVerses]);
  const moveReading = (direction: number) => {
    if (!reading) return;
    const index = verses.findIndex((v) => v.id === reading.id);
    setReading(verses[(index + direction + verses.length) % verses.length]);
  };
  return (
    <>
      <PageHeader eyebrow="QUR’ON · TANLANGAN OYATLAR" title="Qalbga taskin beruvchi oyatlar." description="Bir oyat. Bir manba. Bir sokin tafakkur. Matnni kontekstdan ajratmasdan o‘rganish uchun ochiq havolalar bilan.">
        <div className="page-header-actions"><Button icon={<BookOpen size={17} />} onClick={() => setReading(daily)}>Sokin o‘qish rejimi</Button><span>{verses.length} ta tanlangan oyat</span></div>
      </PageHeader>
      <section className="section quran-daily"><div className="container"><div className="daily-meta"><span>BUGUNGI OYAT</span><p>{formatUzDate(new Date())}</p><i /></div><Reveal direction="scale"><VerseCard verse={daily} featured /></Reveal><Reveal className="daily-reflection-link"><span>Oyatdan keyin bir savol</span><p>{daily.reflection}</p><Link to={`/tafakkur?prompt=${encodeURIComponent(daily.reflection)}`}>Tafakkurga olib borish <ArrowRight size={15} /></Link></Reveal></div></section>
      <section className="section verse-library"><div className="container"><SectionHeading eyebrow="OYATLAR TO‘PLAMI" title="Mavzu orqali qidiring." text="Har bir karta arabcha matn, o‘zbekcha qisqa ma’no, sura va oyat raqami hamda manbani saqlaydi." />
        <div className="library-controls"><div className="search-field"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Sura, ma’no yoki mavzu…" aria-label="Oyatlarni qidirish" />{query && <button onClick={() => setQuery("")}>Tozalash</button>}</div><button className={`saved-filter ${savedOnly ? "active" : ""}`} onClick={() => setSavedOnly(!savedOnly)} aria-pressed={savedOnly}><Bookmark size={16} />Saqanganlar <span>{state.savedVerses.length}</span></button></div>
        <div className="filter-scroll" aria-label="Mavzu filtrlari">{themes.map((item) => <button key={item} className={theme === item ? "active" : ""} onClick={() => setTheme(item)}>{item}</button>)}</div>
        <div className="results-count"><span>{filtered.length} natija</span><i /></div>
        <motion.div layout className="verse-grid"><AnimatePresence mode="popLayout">{filtered.map((verse, index) => <motion.div layout key={verse.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ delay: index * .035 }}><VerseCard verse={verse} /><button className="reading-link" onClick={() => setReading(verse)}>Chalg‘itmasdan o‘qish <ArrowRight size={14} /></button></motion.div>)}</AnimatePresence></motion.div>
        {!filtered.length && <EmptyState title="Bu izda oyat topilmadi" text="Qidiruv so‘zini yoki mavzu filtrini o‘zgartirib ko‘ring." action={<Button variant="secondary" onClick={() => { setTheme("Barchasi"); setQuery(""); setSavedOnly(false); }}>Filtrlarni tozalash</Button>} />}
      </div></section>
      <section className="source-manifesto"><div className="container"><Reveal><span>MANBA VA MAS’ULIYAT</span><h2>Har bir ma’no<br />o‘z manbasiga ega.</h2></Reveal><Reveal delay={.1}><p>SUKUN oyatlarning qisqa o‘zbekcha ma’nolarini tanishtirish uchun taqdim etadi. Bu matnlar mustaqil tafsir yoki fatvo emas. Aniq diniy masalalarda oyat atrofidagi kontekst, tan olingan tafsir va malakali ustoz muhim.</p><a href="https://quran.com" target="_blank" rel="noreferrer">Quran.com manbasini ochish <ExternalLink size={15} /></a></Reveal></div></section>
      <Modal open={!!reading} onClose={() => setReading(null)} title={reading ? `${reading.surahName} · ${reading.surah}:${reading.ayah}` : "Oyat"} wide>
        {reading && <div className="reading-mode"><span className="reading-kicker">SOKIN O‘QISH{reading.excerpt ? " · OYATDAN PARCHA" : ""}</span><p className="reading-arabic" lang="ar" dir="rtl">{reading.arabic}</p><p className="reading-translation">{reading.translation}</p><p className="reading-prompt">{reading.reflection}</p><VerseCard verse={reading} /><div className="reading-navigation"><Button variant="secondary" onClick={() => moveReading(-1)} icon={<ArrowLeft size={16} />}>Oldingi</Button><span>{verses.findIndex((v) => v.id === reading.id) + 1} / {verses.length}</span><Button variant="secondary" onClick={() => moveReading(1)} icon={<ArrowRight size={16} />}>Keyingi</Button></div></div>}
      </Modal>
    </>
  );
}
