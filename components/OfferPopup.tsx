"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { site, waHref } from "@/lib/site";
import { img } from "@/lib/images";

type T = {
  badge: string; title: string; perMonth: string; save: string; points: string[];
  endsIn: string; units: string[]; cta: string; no: string; close: string; wa: string;
};
type Plan = { name: string; price: string; period: string };

const SNOOZE_KEY = "offer-snooze-until";

function readSnooze() {
  try { return Number(localStorage.getItem(SNOOZE_KEY) || 0); } catch { return 0; }
}
function snooze(days: number) {
  try { localStorage.setItem(SNOOZE_KEY, String(Date.now() + days * 86_400_000)); } catch {}
}

/**
 * "Limited offer" popup for the 12-month plan.
 * Honest by design: the savings are computed from real prices, the countdown runs to a
 * fixed end date from lib/site.ts (same for everyone, never resets), and the popup
 * disappears on its own once that date has passed.
 */
export default function OfferPopup({ t, plan, monthlyPrice, locale }: { t: T; plan: Plan; monthlyPrice: number; locale: string }) {
  const pathname = usePathname();
  const cfg = site.offer;
  const end = new Date(cfg.endsAt).getTime();

  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false); // drives the enter/exit transition
  const [left, setLeft] = useState(end - Date.now());
  const closeRef = useRef<HTMLButtonElement>(null);

  const eligible = cfg.enabled && !pathname.includes("/checkout");

  // Decide when to open: after a delay, or once the visitor has scrolled a good way down.
  useEffect(() => {
    if (!eligible || Date.now() >= end || readSnooze() > Date.now()) return;
    let done = false;
    const trigger = () => { if (done) return; done = true; setOpen(true); requestAnimationFrame(() => setShown(true)); cleanup(); };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.45) trigger();
    };
    const timer = window.setTimeout(trigger, cfg.delayMs);
    window.addEventListener("scroll", onScroll, { passive: true });
    function cleanup() { window.clearTimeout(timer); window.removeEventListener("scroll", onScroll); }
    return cleanup;
  }, [eligible, end, cfg.delayMs]);

  const close = useCallback(() => {
    snooze(cfg.snoozeDays);
    setShown(false);
    window.setTimeout(() => setOpen(false), 300);
  }, [cfg.snoozeDays]);

  // Countdown, Esc to close, focus, and page scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const tick = window.setInterval(() => {
      const ms = end - Date.now();
      setLeft(ms);
      if (ms <= 0) close();
    }, 1000);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { window.clearInterval(tick); document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, end, close]);

  if (!open) return null;

  const price = Number(plan.price);
  const months = parseInt(plan.period, 10) || 12;
  const pm = Math.round(price / months);
  const pct = Math.round((1 - price / (monthlyPrice * months)) * 100);
  const date = new Date(end).toLocaleDateString(locale === "no" ? "nb-NO" : "en-GB", { day: "numeric", month: "long" });

  const s = Math.max(0, Math.floor(left / 1000));
  const parts = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];

  const href = waHref({
    locale,
    intro: t.wa.replace("{plan}", plan.name).replace("{price}", plan.price),
    button: `Popup – ${t.cta}`,
    path: pathname,
  });

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="offer-title">
      <button aria-label={t.close} onClick={close}
        className={`absolute inset-0 cursor-default bg-bg/75 backdrop-blur-sm transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"}`} />

      <div className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-[0_40px_120px_-20px_rgba(0,0,0,.9)] transition duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-95 opacity-0"}`}>
        {/* Header image */}
        <div className="relative h-40 overflow-hidden">
          <Image src={img.aurora} alt="" fill sizes="448px" className="drift object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-white" />{t.badge}
          </span>
          <button ref={closeRef} onClick={close} aria-label={t.close}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          {pct > 0 && (
            <span className="absolute bottom-3 right-5 rotate-[-4deg] rounded-xl bg-white px-3 py-1.5 text-lg font-extrabold text-accent shadow-xl">−{pct}%</span>
          )}
        </div>

        <div className="px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
          <h2 id="offer-title" className="text-3xl font-semibold tracking-tight text-fg">
            {t.title.replace("{plan}", plan.name).replace("{price}", plan.price)}
          </h2>
          <p className="mt-1 text-lg font-medium text-accent-hi">{t.perMonth.replace("{pm}", String(pm))}</p>
          {pct > 0 && <p className="mt-2 text-sm text-muted">{t.save.replace("{pct}", String(pct))}</p>}

          {/* Countdown to the real end date */}
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">{t.endsIn.replace("{date}", date)}</p>
            <div className="mt-2 grid grid-cols-4 gap-2" aria-live="off">
              {parts.map((v, i) => (
                <div key={i} className="rounded-xl border border-line bg-white/[0.03] py-2.5 text-center">
                  <span className="block text-2xl font-semibold tabular-nums text-fg">{String(v).padStart(2, "0")}</span>
                  <span className="text-[11px] uppercase tracking-wide text-muted">{t.units[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2">
            {t.points.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-fg/85">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-accent-hi" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
                {p}
              </li>
            ))}
          </ul>

          <a href={href} onClick={() => snooze(cfg.snoozeDays)} className="btn-primary mt-7 w-full !py-3.5 text-base">{t.cta}</a>
          <button onClick={close} className="mt-3 w-full py-2 text-sm text-muted transition hover:text-fg">{t.no}</button>
        </div>
      </div>
    </div>
  );
}
