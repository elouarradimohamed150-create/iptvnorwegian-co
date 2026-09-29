import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, getDictionary } from "@/lib/i18n";

export const metadata: Metadata = { robots: { index: false } };

export default async function Success({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = getDictionary(locale).checkout.success;
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center px-5 pt-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 text-green-400">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
      </span>
      <h1 className="mt-8 text-4xl font-semibold tracking-tightest text-fg">{t.title}</h1>
      <p className="lead mt-4">{t.text}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href={`/${locale}/installation`} className="btn-primary">{t.cta}</Link>
        <Link href={`/${locale}`} className="btn-ghost">{t.home}</Link>
      </div>
    </section>
  );
}
