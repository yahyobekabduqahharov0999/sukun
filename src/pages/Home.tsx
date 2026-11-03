import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, Circle, PenLine, Plus, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import Recommender from "../components/Recommender";
import { AbstractSymbol, BrandMark, Button, Eyebrow, Reveal, SectionHeading, useToast } from "../components/UI";
import VerseCard from "../components/VerseCard";
import { articles, categories, getDailyPrompt, getDailyVerse, journey, practices, reflectionPrompts } from "../data/content";
import { Link } from "../lib/router";
import { toDateKey, useSukun } from "../lib/store";

function scrollTo(id: string, reduced: boolean) {
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 210]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.38]);
  const opacity = useTransform(scrollYProgress, [0, .82], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(14px)"]);
  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduced) return;
    const x = (event.clientX / window.innerWidth - .5) * 2;
    const y = (event.clientY / window.innerHeight - .5) * 2;
    event.currentTarget.style.setProperty("--hero-rx", `${-y * 3}deg`);
    event.currentTarget.style.setProperty("--hero-ry", `${x * 5}deg`);
  };
  return (
    <section className="hero" ref={ref} onPointerMove={onPointerMove}>
      <div className="hero-side-note"><span>01</span><p>RAQAMLI<br />SOKIN MAKON</p></div>
      <motion.div className="hero-content" style={reduced ? undefined : { y, scale, opacity, filter: blur }}>
        <motion.div className="hero-emblem" initial={reduced ? { opacity: 1 } : { opacity: 0, scale: .6, rotate: -30 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.8, delay: .25, ease: [0.22, 1, 0.36, 1] }}><BrandMark /></motion.div>
        <div className="hero-wordmark" aria-label="SUKUN">
          {"SUKUN".split("").map((letter, index) => <span className="letter-mask" key={index}><motion.i initial={reduced ? { y: 0 } : { y: "115%", rotateX: -75 }} animate={{ y: 0, rotateX: 0 }} transition={{ duration: 1.25, delay: .35 + index * .085, ease: [0.16, 1, 0.3, 1] }}>{letter}</motion.i></span>)}
        </div>
        <motion.div className="hero-copy" initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}>
          <h2>Qalbingizga sokinlik.</h2>
          <p>Ilm, tafakkur va iymon sari o‘z yo‘lingizni boshlang.</p>
          <div className="hero-actions"><Button onClick={() => scrollTo("welcome", !!reduced)} icon={<ArrowRight size={17} />}>Sayohatni boshlash</Button><Button variant="secondary" onClick={() => scrollTo("welcome", !!reduced)}>SUKUN haqida</Button></div>
        </motion.div>
      </motion.div>
      <motion.button className="hero-scroll" onClick={() => scrollTo("welcome", !!reduced)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }} aria-label="Pastga suring"><span>PASTGA</span><i><ArrowDown size={15} /></i></motion.button>
      <div className="hero-coordinate">41.2995° N&nbsp;&nbsp; · &nbsp;&nbsp;ICHKI MAKON</div>
    </section>
  );
}

function Welcome() {
  const reduced = useReducedMotion();
  return (
    <section className="section welcome-section" id="welcome">
      <div className="container welcome-grid">
        <div className="welcome-copy">
          <Reveal><Eyebrow>SUKUNGA XUSH KELIBSIZ</Eyebrow><h2>Har bir qalb<br /><em>sokinlikka</em> muhtoj.</h2></Reveal>
          <Reveal delay={.12}><p>Ba’zan hayot shovqinidan bir oz uzoqlashib, qalbimizni tinglash, ilm olish va o‘zimizni anglash uchun vaqt kerak.</p><Button variant="secondary" onClick={() => scrollTo("reflection-home", !!reduced)} icon={<ArrowRight size={16} />}>Bugun o‘zingiz uchun vaqt ajrating</Button></Reveal>
        </div>
        <Reveal className="welcome-visual" direction="scale">
          <div className="visual-arch arch-back" /><div className="visual-arch arch-front" />
          <div className="welcome-orb"><AbstractSymbol type="orbit" /><span>Bir lahza.<br />Bir nafas.<br />Bir qadam.</span></div>
          <div className="visual-caption"><Circle size={8} fill="currentColor" /><span>Shovqindan ma’noga</span></div>
        </Reveal>
      </div>
    </section>
  );
}

const starts = [
  { x: -235, y: -150, r: -8 }, { x: 225, y: -145, r: 7 }, { x: -215, y: 155, r: 6 }, { x: 235, y: 155, r: -7 },
];
const ends = [{ x: -345, y: 85 }, { x: -115, y: 85 }, { x: 115, y: 85 }, { x: 345, y: 85 }];

function JourneyNode({ item, index, progress }: { item: typeof journey[number]; index: number; progress: MotionValue<number> }) {
  const x = useTransform(progress, [0, .72], [starts[index].x, ends[index].x]);
  const y = useTransform(progress, [0, .72], [starts[index].y, ends[index].y]);
  const rotate = useTransform(progress, [0, .72], [starts[index].r, 0]);
  const scale = useTransform(progress, [0, .2, .72], [.88, 1, .94]);
  return <motion.div className="journey-node" style={{ x, y, rotate, scale }}><Link to={item.route}><div className="journey-node-top"><span>{item.number}</span><ArrowUpRight size={17} /></div><AbstractSymbol type={item.symbol} /><div><h3>{item.title}</h3><p>{item.subtitle}</p></div></Link></motion.div>;
}

function DailyJourney() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const coreScale = useTransform(scrollYProgress, [0, .7], [1, .42]);
  const coreOpacity = useTransform(scrollYProgress, [0, .48, .74], [1, .72, 0]);
  return (
    <section className={`journey-scroll ${reduced ? "journey-reduced" : ""}`} ref={ref} id="daily">
      <div className="journey-sticky">
        <div className="container journey-title"><Eyebrow>BUGUNGI RUHIY SAYOHAT</Eyebrow><h2>Bugungi yo‘lingiz</h2><p>To‘rt yo‘nalish. O‘zingizga kerakli joydan boshlang.</p></div>
        <div className="journey-stage">
          <motion.div className="journey-core" style={{ scale: coreScale, opacity: coreOpacity }}><BrandMark /><span>SUKUN</span></motion.div>
          {journey.map((item, index) => <JourneyNode key={item.id} item={item} index={index} progress={scrollYProgress} />)}
        </div>
        <div className="journey-progress"><span>YO‘LNI KASHF ETING</span><i><motion.b style={{ scaleX: scrollYProgress }} /></i></div>
      </div>
    </section>
  );
}

function VerseSection() {
  const verse = getDailyVerse();
  return (
    <section className="section verse-section">
      <div className="container">
        <div className="section-split-heading"><SectionHeading eyebrow="BUGUNGI OYAT" title="Qalbga taskin beruvchi oyatlar" text="Arabcha matn, qisqa o‘zbekcha ma’no va ochiq manba. Shoshilmasdan o‘qing." /><Reveal delay={.1}><Link className="text-link" to="/quron">Barcha oyatlar <ArrowUpRight size={16} /></Link></Reveal></div>
        <Reveal direction="scale"><VerseCard verse={verse} featured /></Reveal>
        <p className="content-note">O‘zbekcha matn oyat ma’nosini tanishtirish uchun berilgan. Chuqur ma’no va diniy xulosalar uchun ishonchli tafsir hamda malakali ustozga murojaat qiling.</p>
      </div>
    </section>
  );
}

function KnowledgeSection() {
  return (
    <section className="section knowledge-home">
      <div className="container knowledge-home-grid">
        <div className="knowledge-intro"><SectionHeading eyebrow="ILM MASKANI" title="Ilm — qalb va tafakkur ziyosi." text="Savol tug‘diradigan, manbasini ko‘rsatadigan va hayotga ehtiyotkorlik bilan qaraydigan matnlar." /><Reveal delay={.1}><div className="knowledge-stat"><strong>{articles.length}</strong><span>tanlangan<br />o‘qish materiali</span></div><Link to="/ilm" className="button button-secondary"><span>Ilm maskaniga kirish</span><ArrowRight size={16} /></Link></Reveal></div>
        <div className="category-list">{categories.map((category, index) => <Reveal key={category.name} delay={index * .055} direction="right"><Link to={`/ilm?category=${encodeURIComponent(category.name)}`} className="category-row"><span className="category-index">{category.index}</span><div><h3>{category.name}</h3><p>{category.description}</p></div><span className="category-count">{articles.filter((a) => a.category === category.name).length} matn</span><ArrowUpRight size={19} /></Link></Reveal>)}</div>
      </div>
    </section>
  );
}

function GuideSection() {
  return <section className="section guide-section"><div className="container guide-grid"><div><SectionHeading eyebrow="SIZGA MOS YO‘L" title="Sizga mos yo‘lni toping." text="Holatingizni yozing. SUKUN shu sahifadagi oyat, o‘qish va amaliyotlardan shaxsiy, tushuntirilgan tavsiya tuzadi." /><Reveal delay={.1}><div className="guide-principles"><span><Check size={14} />Manbasi ko‘rinadi</span><span><Check size={14} />Diniy avtoritet emas</span><span><Check size={14} />So‘rov serverga chiqmaydi</span></div></Reveal></div><Reveal direction="right"><Recommender /></Reveal></div></section>;
}

function ReflectionSection() {
  const daily = getDailyPrompt();
  const [prompt, setPrompt] = useState(daily.text);
  const [text, setText] = useState("");
  const { state, saveReflection } = useSukun();
  const { toast } = useToast();
  const save = () => {
    if (text.trim().length < 3) { toast("Avval bir necha so‘z yozing.", "info"); return; }
    saveReflection({ prompt, text, mood: "Xotirjam" });
    setText("");
    toast("Tafakkur shaxsiy kundalikka saqlandi");
  };
  return (
    <section className="section reflection-home" id="reflection-home">
      <div className="container">
        <SectionHeading eyebrow="TAFAKKUR" title="Bir lahza to‘xtang. O‘zingizni tinglang." text="To‘g‘ri javob kerak emas. Faqat samimiy bir lahza." align="center" />
        <div className="reflection-workspace">
          <div className="prompt-list">{reflectionPrompts.slice(0, 4).map((item, index) => <Reveal key={item.id} delay={index * .06}><button className={prompt === item.text ? "active" : ""} onClick={() => setPrompt(item.text)}><span>0{index + 1}</span>{item.text}<ChevronRight size={17} /></button></Reveal>)}</div>
          <Reveal className="journal-quick" direction="scale"><div className="journal-quick-top"><PenLine size={18} /><span>SHAXSIY YOZUV</span><small>Faqat shu brauzerda</small></div><label htmlFor="home-reflection">{prompt}</label><textarea id="home-reflection" value={text} onChange={(e) => setText(e.target.value)} placeholder="Fikringizni shu yerga yozing…" rows={6} maxLength={4000} /><div className="journal-bottom"><span>{text.length} / 4000</span><Button onClick={save} icon={<ArrowRight size={16} />}>Saqlash</Button></div><div className="journal-history-link"><span>{state.reflections.length} ta shaxsiy yozuv</span><Link to="/tafakkur">Kundalikni ochish <ArrowUpRight size={14} /></Link></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function GratitudeSection() {
  const today = toDateKey(new Date());
  const { state, saveGratitude } = useSukun();
  const existing = state.gratitude[today]?.items;
  const [items, setItems] = useState<[string, string, string]>(existing ? [existing[0], existing[1], existing[2]] : ["", "", ""]);
  const { toast } = useToast();
  const update = (index: number, value: string) => setItems((old) => old.map((item, i) => i === index ? value : item) as [string, string, string]);
  const save = () => {
    if (items.some((item) => !item.trim())) { toast("Uchala ne’mat uchun ham qisqa yozuv kiriting.", "info"); return; }
    saveGratitude(today, items.map((item) => item.trim()) as [string, string, string]);
    toast("Bugungi shukronalik saqlandi");
  };
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return toDateKey(d); });
  return (
    <section className="section gratitude-home">
      <div className="container gratitude-home-grid">
        <div className="gratitude-copy"><SectionHeading eyebrow="SHUKRONALIK KUNDALIGI" title="Shukr bilan yashash." text="Katta javoblar emas, bugun payqagan uchta kichik ne’matingiz." /><Reveal><div className="week-trace">{week.map((day) => { const d = new Date(`${day}T12:00:00`); return <div key={day} className={state.gratitude[day] ? "filled" : ""}><span>{new Intl.DateTimeFormat("uz-UZ", { weekday: "short" }).format(d)}</span><i>{state.gratitude[day] ? <Check size={13} /> : d.getDate()}</i></div>; })}</div><Link to="/shukronalik" className="text-link">Kalendar va tarix <ArrowUpRight size={15} /></Link></Reveal></div>
        <Reveal className="gratitude-note" direction="right"><div className="gratitude-note-head"><span>BUGUN UCHUN</span><Sparkles size={17} /></div>{items.map((item, index) => <label key={index}><span>0{index + 1}</span><input value={item} onChange={(e) => update(index, e.target.value)} placeholder={["Bugun nima sizga yengillik berdi?", "Kimning mehrini his qildingiz?", "Qaysi oddiy ne’matni payqadingiz?"][index]} maxLength={240} /></label>)}<Button onClick={save} icon={<ArrowRight size={16} />}>Bugungi shukrni saqlash</Button><p>Yozuvlaringiz ochiq havolada ko‘rinmaydi va serverga yuborilmaydi.</p></Reveal>
      </div>
    </section>
  );
}

function GrowthSection() {
  const { state, completeActivity, removeActivity } = useSukun();
  const { toast } = useToast();
  const today = toDateKey(new Date());
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return toDateKey(d); });
  const max = Math.max(1, ...days.map((day) => state.activities.filter((a) => a.date === day).length));
  const toggle = (practice: typeof practices[number]) => {
    const done = state.activities.find((a) => a.taskId === practice.id && a.date === today);
    if (done) { removeActivity(done.id); toast("Bugungi belgi olindi", "info"); }
    else { completeActivity({ taskId: practice.id, title: practice.title, date: today, note: "", minutes: practice.minutes }); toast("Kichik qadam belgilandi"); }
  };
  return (
    <section className="section growth-home">
      <div className="container">
        <div className="section-split-heading"><SectionHeading eyebrow="SHAXSIY RIVOJLANISH" title="Har kuni bir qadam." text="Mukammallik emas, o‘zingizga mos va mazmunli davomiylik." /><Reveal><Link className="text-link" to="/rivojlanish">Maqsadlar va barcha amaliyotlar <ArrowUpRight size={16} /></Link></Reveal></div>
        <div className="growth-home-grid">
          <div className="today-practices">{practices.slice(0, 3).map((practice, index) => { const done = state.activities.some((a) => a.taskId === practice.id && a.date === today); return <Reveal key={practice.id} delay={index * .07}><div className={`practice-preview ${done ? "done" : ""}`}><button className="practice-check" onClick={() => toggle(practice)} aria-label={done ? `${practice.title} belgisini olish` : `${practice.title} bajarildi`} aria-pressed={done}>{done ? <Check size={17} /> : <Plus size={17} />}</button><div><span>{practice.category} · {practice.minutes} daqiqa</span><h3>{practice.title}</h3></div><small>{done ? "Bugun bajarildi" : "Bugun uchun"}</small></div></Reveal>; })}</div>
          <Reveal className="mini-progress" direction="scale"><div className="mini-progress-head"><div><span>SO‘NGGI 7 KUN</span><strong>{state.activities.filter((a) => days.includes(a.date)).length} qadam</strong></div><BookOpen size={19} /></div><div className="mini-chart">{days.map((day) => { const count = state.activities.filter((a) => a.date === day).length; const d = new Date(`${day}T12:00:00`); return <div key={day}><div className="bar-track"><motion.i initial={{ height: 0 }} whileInView={{ height: `${Math.max(count ? 16 : 2, (count / max) * 100)}%` }} viewport={{ once: true }} transition={{ duration: .8 }} /></div><span>{new Intl.DateTimeFormat("uz-UZ", { weekday: "narrow" }).format(d)}</span></div>; })}</div><p>Grafik faqat siz belgilagan haqiqiy amaliyatlarni ko‘rsatadi. Bo‘sh kun — muvaffaqiyatsizlik emas.</p></Reveal>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return <section className="closing-section"><div className="closing-rings" aria-hidden="true"><span /><span /><span /></div><Reveal className="container closing-content" direction="scale"><BrandMark /><p>Find peace. Seek knowledge. Grow with purpose.</p><h2>Qalbingizga qaytadigan<br />makon shu yerda.</h2><Link to="/tafakkur" className="button button-primary"><span>Bugungi bir lahzani boshlang</span><ArrowRight size={17} /></Link></Reveal></section>;
}

export default function Home() {
  return <><Hero /><div className="home-content"><Welcome /><DailyJourney /><VerseSection /><KnowledgeSection /><GuideSection /><ReflectionSection /><GratitudeSection /><GrowthSection /><Closing /></div></>;
}
