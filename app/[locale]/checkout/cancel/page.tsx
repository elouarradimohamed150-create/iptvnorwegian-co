import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, getDictionary } from "@/lib/i18n";

export const metadata: Metadata = { robots: { index: false } };

export default async function Cancel({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = getDictionary(locale).checkout.cancel;
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center px-5 pt-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tightest text-fg">{t.title}</h1>
      <p className="lead mt-4">{t.text}</p>
      <Link href={`/${locale}#pricing`} className="btn-primary mt-10">{t.cta}</Link>
    </section>
  );
}
