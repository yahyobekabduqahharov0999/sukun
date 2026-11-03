import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="27.5" stroke="currentColor" strokeOpacity=".34" />
      <path d="M32 9 37.5 24.5 53 30 37.5 35.5 32 51 26.5 35.5 11 30 26.5 24.5 32 9Z" stroke="currentColor" strokeWidth=".8" strokeOpacity=".72" />
      <path d="M39.5 20.5C35 16.5 26.5 18 23 24.5C19 32 25 39 32 39C40 39 44 32 41.5 26.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="37.5" cy="17" r="2.8" fill="currentColor" />
    </svg>
  );
}

export function AbstractSymbol({ type, className = "" }: { type: string; className?: string }) {
  return (
    <div className={`abstract-symbol symbol-${type} ${className}`} aria-hidden="true">
      <span className="symbol-orbit" />
      <span className="symbol-core" />
      <span className="symbol-satellite" />
      <span className="symbol-line" />
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow"><span />{children}</div>;
}

export function SectionHeading({ eyebrow, title, text, align = "left" }: { eyebrow?: string; title: string; text?: string; align?: "left" | "center" }) {
  return (
    <Reveal className={`section-heading ${align === "center" ? "center" : ""}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  );
}

export function Reveal({ children, className = "", delay = 0, direction = "up" }: { children: ReactNode; className?: string; delay?: number; direction?: "up" | "left" | "right" | "scale" }) {
  const reduce = useReducedMotion();
  const hidden = reduce ? { opacity: 1 } : direction === "left" ? { opacity: 0, x: -44, rotateY: 6 } : direction === "right" ? { opacity: 0, x: 44, rotateY: -6 } : direction === "scale" ? { opacity: 0, scale: .92, filter: "blur(8px)" } : { opacity: 0, y: 42, clipPath: "inset(0 0 18% 0)" };
  const visible = reduce ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" };
  return (
    <motion.div className={className} initial={hidden} whileInView={visible} viewport={{ once: true, amount: .15 }} transition={{ duration: .9, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "text"; icon?: ReactNode };
export function Button({ variant = "primary", icon, children, className = "", ...props }: ButtonProps) {
  return <button className={`button button-${variant} ${className}`} {...props}><span>{children}</span>{icon && <span className="button-icon">{icon}</span>}</button>;
}

export function IconButton({ label, children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return <button className={`icon-button ${className}`} aria-label={label} title={label} {...props}>{children}</button>;
}

export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => panel.current?.focus(), 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key === "Tab" && panel.current) {
        const focusable = Array.from(panel.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex="0"]'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`modal-panel ${wide ? "modal-wide" : ""}`} initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: .98 }} transition={{ duration: .4, ease: [0.22, 1, 0.36, 1] }}>
            <div className="modal-header"><h2 id={titleId}>{title}</h2><IconButton label="Yopish" onClick={onClose}><X size={19} /></IconButton></div>
            <div className="modal-content">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>, document.body,
  );
}

type Toast = { id: number; message: string; kind: "success" | "info" };
type ToastContextValue = { toast: (message: string, kind?: "success" | "info") => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((message: string, kind: "success" | "info" = "success") => {
    const id = Date.now() + Math.random();
    setToasts((items) => [...items.slice(-2), { id, message, kind }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3400);
  }, []);
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(<div className="toast-region" aria-live="polite" aria-atomic="false"><AnimatePresence initial={false}>{toasts.map((item) => (
        <motion.div key={item.id} className="toast" initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 30 }} layout>
          <span className="toast-symbol">{item.kind === "success" ? <Check size={15} /> : <Info size={15} />}</span>{item.message}
        </motion.div>
      ))}</AnimatePresence></div>, document.body)}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider");
  return value;
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <div className="empty-state"><BrandMark /><h3>{title}</h3><p>{text}</p>{action}</div>;
}

export async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const success = document.execCommand("copy");
  area.remove();
  if (!success) throw new Error("Copy failed");
}
