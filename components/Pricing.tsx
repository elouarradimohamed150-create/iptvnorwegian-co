"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import PaymentBadges from "./PaymentBadges";
import CountUp from "./CountUp";
import Reveal from "./Reveal";
import { waHref } from "@/lib/site";

type Plan = { name: string; price: string; period: string; popular?: boolean };
type T = {
  currency: string; cta: string; popular: string; note: string; support: string; features: string[]; plans: Plan[];
  loading: string; secure: string; error: string; waOrder: string; waTrial: string; waHelp: string;
};

function CheckCircle() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0 text-accent-hi" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" /><path d="M7.5 12.5l3 3 6-6.5" />
    </svg>
  );
}


export default function Pricing({ t }: { t: T }) {
  const { locale } = useParams<{ locale: string }>();
  const [busy, setBusy] = useState<number | null>(null);
  const [err, setErr] = useState<number | null>(null);

  const waFor = (p: Plan) => waHref({ locale, button: t.cta, path: `/${locale}#pricing`, intro: Number(p.price) === 0 ? t.waTrial : t.waOrder.replace("{plan}", p.name).replace("{price}", p.price) });

  // Buttons are real WhatsApp links. Only when Stripe is switched on
  // (NEXT_PUBLIC_CHECKOUT=stripe) does a click on a paid plan go to card checkout instead.
  const stripeOn = process.env.NEXT_PUBLIC_CHECKOUT === "stripe";

  async function order(e: React.MouseEvent, p: Plan, i: number) {
    if (!stripeOn || Number(p.price) === 0) return; // follow the WhatsApp link
    e.preventDefault();
    setBusy(i); setErr(null);
    try {
      const paidIndex = t.plans.filter((x) => Number(x.price) > 0).indexOf(p);
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale, plan: paidIndex }) });
      const data = await res.json().catch(() => ({}));
      if (data.url) { window.location.href = data.url; return; }
      if (data.fallback) { window.location.href = waFor(p); setBusy(null); return; }
      throw new Error();
    } catch { setErr(i); setBusy(null); }
  }

  return (
    <div>
      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {t.plans.map((p, i) => {
          const shown = Number(p.price) === 0 ? "00" : p.price;
          return (
            <Reveal key={p.name} anim="up" delay={(i % 3) * 120} className="h-full">
            <div
              className={`spot group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface text-fg transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_0_28px_-4px_rgba(200,16,46,.45)] ${p.popular ? "border-accent/50 shadow-[0_0_24px_-6px_rgba(200,16,46,.5)]" : "border-line"}`}>
              <h3 className="pb-3 pt-5 text-center text-[30px] font-semibold leading-tight tracking-tight sm:text-[34px]">{p.name}</h3>
              <div className="relative flex min-h-[92px] items-start justify-center gap-1.5 overflow-hidden bg-gradient-to-r from-accent-lo via-accent to-accent-lo px-3 py-3 text-white">
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/20 transition-all duration-1000 group-hover:left-[130%]" />
                <span className="mt-3 text-xl font-medium text-white/80">{t.currency}</span>
                <span className="text-[72px] font-semibold leading-none tracking-tight tabular-nums">{Number(p.price) === 0 ? shown : <CountUp value={Number(p.price)} />}</span>
              </div>
              <ul className="flex-1 bg-white/[0.02] px-6 py-4">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center justify-center gap-2.5 border-b border-line py-2.5 text-center text-[14px] text-muted last:border-0">
                    <CheckCircle />{f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col items-center px-6 pb-7 pt-6">
                <a href={waFor(p)} onClick={(e) => order(e, p, i)} aria-disabled={busy === i}
                  className="block w-full rounded-full bg-accent px-10 py-3.5 text-center text-lg font-semibold text-white transition hover:bg-accent-hi aria-disabled:opacity-70">
                  {busy === i ? t.loading : t.cta}
                </a>
                {err === i && <p role="alert" className="mt-3 text-center text-sm text-red-400">{t.error}</p>}
              </div>
            </div>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" /></svg>
          {t.secure} Stripe
        </span>
        <PaymentBadges />
      </div>
      <p className="mx-auto mt-6 max-w-xl text-center text-sm text-muted">
        {t.note} <a href={waHref({ locale, intro: t.waHelp, button: t.support, path: `/${locale}#pricing` })} className="text-fg underline-offset-4 hover:underline">{t.support}</a>
      </p>
    </div>
  );
}
