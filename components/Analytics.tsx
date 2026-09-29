"use client";
import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";

// Plausible (NEXT_PUBLIC_PLAUSIBLE_DOMAIN) is cookie-free and loads without consent.
// Google Analytics (NEXT_PUBLIC_GA_ID) sets cookies, so it only loads after the visitor accepts.
const PLAUSIBLE = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const GA = process.env.NEXT_PUBLIC_GA_ID;
const KEY = "cookie-consent";

type T = { text: string; accept: string; decline: string; more: string };

export default function Analytics({ t, privacyHref }: { t: T; privacyHref: string }) {
  const [consent, setConsent] = useState<"granted" | "denied" | null | undefined>(undefined);

  useEffect(() => {
    try { setConsent((localStorage.getItem(KEY) as "granted" | "denied" | null) ?? null); } catch { setConsent(null); }
  }, []);

  function choose(v: "granted" | "denied") {
    try { localStorage.setItem(KEY, v); } catch {}
    setConsent(v);
  }

  return (
    <>
      {PLAUSIBLE && <Script defer data-domain={PLAUSIBLE} src="https://plausible.io/js/script.js" strategy="afterInteractive" />}
      {GA && consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA}',{anonymize_ip:true});`}</Script>
        </>
      )}
      {GA && consent === null && (
        <div role="dialog" aria-live="polite" className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl rounded-2xl border border-line bg-surface/95 p-5 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:left-6">
          <p className="text-sm leading-relaxed text-muted">
            {t.text} <Link href={privacyHref} className="text-fg underline underline-offset-4">{t.more}</Link>
          </p>
          <div className="mt-4 flex gap-2">
            <button onClick={() => choose("granted")} className="btn-primary !px-5 !py-2 text-sm">{t.accept}</button>
            <button onClick={() => choose("denied")} className="btn-ghost !px-5 !py-2 text-sm">{t.decline}</button>
          </div>
        </div>
      )}
    </>
  );
}
