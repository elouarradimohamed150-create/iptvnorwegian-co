import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import Logo from "./Logo";
import PaymentBadges from "./PaymentBadges";

type T = { tagline: string; rights: string; terms: string; refund: string; privacy: string; orgnr: string; status: string; reviews: string; cols: { product: string; company: string; legal: string } };

export default function Footer({ locale, t, nav }: { locale: Locale; t: T; nav: Record<string, string> }) {
  const cols = [
    { title: t.cols.product, links: [
      { href: `/${locale}#pricing`, label: locale === "no" ? "Priser" : "Pricing" },
      { href: `/${locale}/installation`, label: nav.installation },
      { href: `/${locale}#faq`, label: "FAQ" },
    ] },
    { title: t.cols.company, links: [
      { href: `/${locale}/about`, label: nav.about },
      { href: `/${locale}/reseller`, label: nav.reseller },
      { href: `/${locale}/contact`, label: nav.contact },
    ] },
    { title: t.cols.legal, links: [
      { href: `/${locale}/terms`, label: t.terms },
      { href: `/${locale}/refund`, label: t.refund },
      { href: `/${locale}/privacy`, label: t.privacy },
    ] },
  ];
  const c = site.company;
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href={`/${locale}`}><Logo /></Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t.tagline}</p>
          <a href={`mailto:${site.email}`} className="mt-4 inline-block text-sm text-fg underline-offset-4 hover:underline">{site.email}</a>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            {site.statusUrl && (
              <a href={site.statusUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted transition hover:text-fg">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" /><span className="relative h-2 w-2 rounded-full bg-green-400" /></span>
                {t.status}
              </a>
            )}
            {site.reviewsUrl && <a href={site.reviewsUrl} target="_blank" rel="noopener noreferrer" className="text-muted transition hover:text-fg">★ {t.reviews}</a>}
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-medium text-fg">{col.title}</p>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {col.links.map((l) => (<li key={l.href}><Link href={l.href} className="transition hover:text-fg">{l.label}</Link></li>))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {c.legalName || site.name}. {t.rights}
            {c.orgNumber && <> · {t.orgnr} {c.orgNumber}</>}
            {c.address && <> · {c.address}</>}
          </p>
          <PaymentBadges />
        </div>
      </div>
    </footer>
  );
}
