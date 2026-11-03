import { Bookmark, Check, Copy, ExternalLink } from "lucide-react";
import type { Verse } from "../data/content";
import { useSukun } from "../lib/store";
import { copyText, IconButton, useToast } from "./UI";

export default function VerseCard({ verse, featured = false }: { verse: Verse; featured?: boolean }) {
  const { state, toggleVerse } = useSukun();
  const { toast } = useToast();
  const saved = state.savedVerses.includes(verse.id);
  const copy = async () => {
    try {
      await copyText(`${verse.arabic}\n\n${verse.translation}\n— ${verse.surahName}, ${verse.surah}:${verse.ayah}${verse.excerpt ? " (oyatdan parcha)" : ""}\n${verse.source}`);
      toast("Oyat va manba nusxalandi");
    } catch { toast("Nusxalash imkoni bo‘lmadi. Matnni qo‘lda belgilang.", "info"); }
  };
  return (
    <article className={`verse-card ${featured ? "verse-featured" : ""}`}>
      <div className="verse-topline"><span>{verse.surahName}</span><span>{verse.surah} : {verse.ayah}{verse.excerpt ? " · Oyatdan parcha" : ""}</span></div>
      <div className="verse-arabic" lang="ar" dir="rtl">{verse.arabic}<span className="ayah-seal">{verse.ayah}</span></div>
      <p className="verse-translation">{verse.translation}</p>
      {featured && <p className="verse-reflection">{verse.reflection}</p>}
      <div className="verse-footer">
        <div className="verse-actions">
          <button className={`save-action ${saved ? "saved" : ""}`} onClick={() => { toggleVerse(verse.id); toast(saved ? "Oyat saqlanganlardan olindi" : "Oyat shaxsiy kabinetga saqlandi"); }} aria-pressed={saved}>{saved ? <Check size={16} /> : <Bookmark size={16} />}{saved ? "Saqlandi" : "Saqlash"}</button>
          <IconButton label="Oyatni nusxalash" onClick={copy}><Copy size={17} /></IconButton>
        </div>
        <a className="source-link" href={verse.source} target="_blank" rel="noreferrer">Qur’on matni <ExternalLink size={13} /></a>
      </div>
    </article>
  );
}
