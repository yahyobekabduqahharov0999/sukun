import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import SanctuaryScene from "./components/SanctuaryScene";
import { BrandMark, ToastProvider } from "./components/UI";
import { Link, RouterProvider, useRouter } from "./lib/router";
import { SukunProvider, useSukun } from "./lib/store";
import Gratitude from "./pages/Gratitude";
import Growth from "./pages/Growth";
import Home from "./pages/Home";
import Knowledge from "./pages/Knowledge";
import Profile from "./pages/Profile";
import Quran from "./pages/Quran";
import Reflection from "./pages/Reflection";

function shouldShowIntro() {
  try { return !sessionStorage.getItem("sukun.intro"); } catch { return true; }
}

function Intro({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(onDone, reduced ? 350 : 1850);
    return () => { clearTimeout(timer); document.body.style.overflow = overflow; };
  }, [onDone, reduced]);
  return <motion.div className="cinematic-intro" exit={reduced ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }} transition={{ duration: reduced ? .2 : .9, ease: [0.76, 0, 0.24, 1] }}><motion.div initial={reduced ? { opacity: 1 } : { opacity: 0, scale: .65, rotate: -40 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.1 }}><BrandMark /></motion.div><div className="intro-word">{"SUKUN".split("").map((letter, index) => <motion.span key={index} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18 + index * .07, duration: .7 }}>{letter}</motion.span>)}</div><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }}>QALBINGIZGA SOKINLIK</motion.p><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduced ? .2 : 1.45, ease: "easeInOut" }} /></motion.div>;
}

function NotFound() {
  return <section className="not-found"><BrandMark /><span>404 · YO‘L TOPILMADI</span><h1>Bu sahifa sokinlikda yo‘qolib qolgan.</h1><p>Bosh sahifaga qaytib, o‘z yo‘lingizni qayta tanlang.</p><Link to="/" className="button button-primary"><ArrowLeft size={16} /><span>Bosh sahifaga qaytish</span></Link></section>;
}

function Experience() {
  const { path } = useRouter();
  const reduced = useReducedMotion();
  const [intro, setIntro] = useState(shouldShowIntro);
  const finishIntro = () => { setIntro(false); try { sessionStorage.setItem("sukun.intro", "1"); } catch { /* session storage may be unavailable */ } };
  const page = path === "/" ? <Home /> : path === "/quron" ? <Quran /> : path === "/ilm" ? <Knowledge /> : path === "/tafakkur" ? <Reflection /> : path === "/shukronalik" ? <Gratitude /> : path === "/rivojlanish" ? <Growth /> : path === "/kabinet" ? <Profile /> : <NotFound />;
  return <>
    <a href="#main-content" className="skip-link">Asosiy tarkibga o‘tish</a>
    <Layout scene={<SanctuaryScene home={path === "/"} />}>
      <AnimatePresence mode="wait" initial={false}><motion.div key={path} className="route-view" initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14, clipPath: "inset(0 0 3% 0)" }} animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }} transition={{ duration: reduced ? .12 : .5, ease: [0.22, 1, 0.36, 1] }}>{page}</motion.div></AnimatePresence>
    </Layout>
    <AnimatePresence>{intro && <Intro onDone={finishIntro} />}</AnimatePresence>
  </>;
}

function MotionRoot() {
  const { state } = useSukun();
  return <MotionConfig reducedMotion={state.settings.motion === "reduced" ? "always" : "user"}><Experience /></MotionConfig>;
}

export default function App() {
  return <SukunProvider><RouterProvider><ToastProvider><MotionRoot /></ToastProvider></RouterProvider></SukunProvider>;
}
