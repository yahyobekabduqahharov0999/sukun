import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouter } from "../lib/router";
import { useSukun } from "../lib/store";
import { BrandMark, Eyebrow } from "./UI";

export const navItems = [
  { path: "/", label: "Bosh sahifa", short: "Bosh" },
  { path: "/quron", label: "Qur’on", short: "Qur’on" },
  { path: "/ilm", label: "Ilm maskani", short: "Ilm" },
  { path: "/tafakkur", label: "Tafakkur", short: "Tafakkur" },
  { path: "/shukronalik", label: "Shukronalik", short: "Shukr" },
  { path: "/rivojlanish", label: "Rivojlanish", short: "Rivoj" },
  { path: "/kabinet", label: "Shaxsiy kabinet", short: "Kabinet" },
];

export function Navigation() {
  const { path } = useRouter();
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 26, restDelta: .001 });

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", escape);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", escape); };
  }, [open]);

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <header className="site-header">
        <Link to="/" className="nav-brand" aria-label="SUKUN — Bosh sahifa"><BrandMark /><span>SUKUN</span></Link>
        <nav className="desktop-nav" aria-label="Asosiy navigatsiya">
          {navItems.map((item) => <Link key={item.path} to={item.path} className={path === item.path ? "active" : ""} aria-current={path === item.path ? "page" : undefined}>{item.label}</Link>)}
        </nav>
        <button className="menu-toggle" onClick={() => setOpen(true)} aria-label="Menyuni ochish" aria-expanded={open}><Menu size={20} /><span>Menyu</span></button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, clipPath: "circle(0% at 92% 5%)" }} animate={{ opacity: 1, clipPath: "circle(150% at 92% 5%)" }} exit={{ opacity: 0, clipPath: "circle(0% at 92% 5%)" }} transition={{ duration: .65, ease: [0.76, 0, 0.24, 1] }}>
            <div className="mobile-menu-top"><Link to="/" className="nav-brand"><BrandMark /><span>SUKUN</span></Link><button className="menu-toggle" onClick={() => setOpen(false)} aria-label="Menyuni yopish"><X size={21} /></button></div>
            <nav aria-label="Mobil navigatsiya">
              {navItems.map((item, index) => (
                <motion.div key={item.path} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .12 + index * .055 }}>
                  <Link to={item.path} className={path === item.path ? "active" : ""}><span className="menu-number">0{index + 1}</span><span>{item.label}</span><ArrowUpRight size={20} /></Link>
                </motion.div>
              ))}
            </nav>
            <p>Find peace. Seek knowledge. Grow with purpose.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function PageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <section className="page-header">
      <div className="page-header-ornament" aria-hidden="true"><span /><span /><span /></div>
      <motion.div className="container page-header-content" initial={reduce ? { opacity: 1 } : { opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </motion.div>
      <div className="page-header-line" />
    </section>
  );
}

export function Footer() {
  const { storageAvailable } = useSukun();
  return (
    <footer className="site-footer">
      <div className="footer-glow" />
      <div className="container footer-main">
        <div className="footer-brand"><BrandMark /><h2>SUKUN</h2><p>Qalbingizga sokinlik.<br />Ilm, tafakkur va iymon sari.</p></div>
        <div className="footer-links"><span>MAKON</span>{navItems.slice(1, 5).map((item) => <Link key={item.path} to={item.path}>{item.label}</Link>)}</div>
        <div className="footer-links"><span>SHAXSIY</span>{navItems.slice(5).map((item) => <Link key={item.path} to={item.path}>{item.label}</Link>)}<Link to="/kabinet?tab=privacy">Maxfiylik</Link></div>
        <div className="footer-note"><span>MAHALLIY TAJRIBA</span><p>{storageAvailable ? "Yozuvlaringiz shu brauzerda saqlanadi. Serverga yuborilmaydi." : "Brauzer saqlashiga ruxsat bermadi. Yozuvlar faqat shu sessiyada qoladi."}</p><Link to="/kabinet?tab=privacy">Ma’lumotlaringizni boshqaring <ArrowUpRight size={14} /></Link></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} SUKUN</span><span>Ehtiyot bilan. Sokinlik bilan.</span><span>Frontend mahsulot prototipi</span></div>
    </footer>
  );
}

export function Layout({ children, scene }: { children: ReactNode; scene: ReactNode }) {
  const { path } = useRouter();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [path]);
  return (
    <div className="app-shell">
      {scene}
      <Navigation />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}
