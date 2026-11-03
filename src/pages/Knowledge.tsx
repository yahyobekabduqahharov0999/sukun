import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Bookmark, Check, Clock, ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "../components/Layout";
import { Button, EmptyState, Modal, Reveal, useToast } from "../components/UI";
import { articles, categories } from "../data/content";
import { Link, useRouter } from "../lib/router";
import { useSukun } from "../lib/store";

export default function Knowledge() {
  const { search, navigate } = useRouter();
  const { state, toggleArticle } = useSukun();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const requestedCategory = search.get("category");
  const activeCategory = categories.some((c) => c.name === requestedCategory) ? requestedCategory! : "Barchasi";
  const selected = articles.find((article) => article.id === search.get("article")) || null;
  const filtered = useMemo(() => articles.filter((article) => {
    const categoryMatch = activeCategory === "Barchasi" || article.category === activeCategory;
    const savedMatch = !savedOnly || state.savedArticles.includes(article.id);
    const haystack = `${article.title} ${article.excerpt} ${article.category} ${article.themes.join(" ")}`.toLowerCase();
    return categoryMatch && savedMatch && haystack.includes(query.trim().toLowerCase());
  }), [activeCategory, savedOnly, query, state.savedArticles]);
  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(search);
    if (value) next.set(key, value); else next.delete(key);
    navigate(`/ilm${next.toString() ? `?${next}` : ""}`);
  };
  const save = (id: string) => {
    const saved = state.savedArticles.includes(id);
    toggleArticle(id);
    toast(saved ? "Matn saqlanganlardan olindi" : "Matn kabinetga saqlandi");
  };
  return (
    <>
      <PageHeader eyebrow="ILM MASKANI" title="Ilm — qalb va tafakkur ziyosi." description="Bilimni ko‘r-ko‘rona qabul qilmasdan, savol bilan o‘qing. Har bir matn o‘z mavzusi, chegarasi va manbasi bilan." />
      <section className="knowledge-catalog section"><div className="container">
        <div className="catalog-layout">
          <aside className="catalog-sidebar"><span>YO‘NALISHLAR</span><button className={activeCategory === "Barchasi" ? "active" : ""} onClick={() => setParam("category")}><i>00</i>Barchasi<small>{articles.length}</small></button>{categories.map((category) => <button key={category.name} className={activeCategory === category.name ? "active" : ""} onClick={() => setParam("category", category.name)}><i>{category.index}</i>{category.name}<small>{articles.filter((a) => a.category === category.name).length}</small></button>)}<div className="catalog-side-note"><p>“Bilmayman” deyish ham bilimga ochiq, halol bir qadamdir.</p></div></aside>
          <div className="catalog-main">
            <div className="catalog-top"><div><span>{activeCategory === "Barchasi" ? "BARCHA MATERIALLAR" : activeCategory.toUpperCase()}</span><h2>{filtered.length} ta o‘qish</h2></div><button className={`saved-filter ${savedOnly ? "active" : ""}`} onClick={() => setSavedOnly(!savedOnly)}><Bookmark size={16} />Saqanganlar <span>{state.savedArticles.length}</span></button></div>
            <div className="search-field catalog-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Mavzu, sarlavha yoki kalit so‘z…" aria-label="Ilm materiallarini qidirish" />{query && <button onClick={() => setQuery("")}>Tozalash</button>}</div>
            <motion.div layout className="article-list"><AnimatePresence mode="popLayout">{filtered.map((article, index) => {
              const saved = state.savedArticles.includes(article.id);
              return <motion.article layout key={article.id} className="article-row" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: index * .035 }}><div className="article-number">{String(articles.indexOf(article) + 1).padStart(2, "0")}</div><button className="article-open" onClick={() => setParam("article", article.id)}><span>{article.category} · {article.level}</span><h3>{article.title}</h3><p>{article.excerpt}</p><div><Clock size={14} />{article.minutes} daqiqa o‘qish <ArrowUpRight size={16} /></div></button><button className={`article-bookmark ${saved ? "saved" : ""}`} onClick={() => save(article.id)} aria-label={saved ? "Saqlanganlardan olish" : "Maqolani saqlash"}>{saved ? <Check size={17} /> : <Bookmark size={17} />}</button></motion.article>;
            })}</AnimatePresence></motion.div>
            {!filtered.length && <EmptyState title="Bu filtrlarda matn yo‘q" text="Boshqa yo‘nalishni tanlang yoki qidiruvni tozalang." action={<Button variant="secondary" onClick={() => { setQuery(""); setSavedOnly(false); setParam("category"); }}>Barcha matnlarni ko‘rish</Button>} />}
          </div>
        </div>
      </div></section>
      <section className="knowledge-method"><div className="container"><Reveal><span>O‘QISH USULI · 01—03</span><h2>Bilimga shoshilmasdan<br />yaqinlashish.</h2></Reveal><div>{[{ n: "01", t: "Kuzating", p: "Matnda nima aniq aytilganini, qaysi fikr sizniki ekanini ajrating." }, { n: "02", t: "Tekshiring", p: "Manbani oching, kontekstni ko‘ring va noaniq joyni savol qilib qoldiring." }, { n: "03", t: "Tafakkur qiling", p: "Bitta kichik savol yoki amaliyot bilan matnni o‘z hayotingizga yaqinlashtiring." }].map((item, i) => <Reveal key={item.n} delay={i * .09}><div><span>{item.n}</span><h3>{item.t}</h3><p>{item.p}</p></div></Reveal>)}</div></div></section>
      <Modal open={!!selected} onClose={() => setParam("article")} title={selected?.category || "Ilm maskani"} wide>
        {selected && <article className="article-reader"><div className="reader-meta"><span>{selected.level}</span><span><Clock size={14} />{selected.minutes} daqiqa</span><button className={state.savedArticles.includes(selected.id) ? "saved" : ""} onClick={() => save(selected.id)}>{state.savedArticles.includes(selected.id) ? <Check size={15} /> : <Bookmark size={15} />}{state.savedArticles.includes(selected.id) ? "Saqlandi" : "Saqlash"}</button></div><h1>{selected.title}</h1><p className="reader-lead">{selected.excerpt}</p><div className="reader-body">{selected.sections.map((section, index) => <section key={section.heading}><span>0{index + 1}</span><div><h2>{section.heading}</h2><p>{section.body}</p></div></section>)}</div><div className="reader-source"><span>MANBA / CHEGARA</span><p>{selected.sourceLabel}</p>{selected.sourceUrl && <a href={selected.sourceUrl} target="_blank" rel="noreferrer">Manbani ochish <ExternalLink size={14} /></a>}</div><div className="reader-question"><span>TAFAKKUR UCHUN</span><h3>{selected.question}</h3><Link to={`/tafakkur?prompt=${encodeURIComponent(selected.question)}`}>Javobni kundalikka yozing <ArrowRight size={16} /></Link></div></article>}
      </Modal>
    </>
  );
}
