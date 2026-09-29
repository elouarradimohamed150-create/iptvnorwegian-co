import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, type Locale, getDictionary } from "@/lib/i18n";
import { site, waHref } from "@/lib/site";
import InstallGuide from "@/components/InstallGuide";
import ContactForm from "@/components/ContactForm";
import { pageGraph, ldScript } from "@/lib/schema";
import Image from "next/image";
import { img } from "@/lib/images";
import Reveal from "@/components/Reveal";

const pages = ["installation", "about", "contact", "reseller", "terms", "refund", "privacy"] as const;
type Page = (typeof pages)[number];
const legal: Page[] = ["terms", "refund", "privacy"];

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => pages.map((page) => ({ locale, page })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; page: string }> }): Promise<Metadata> {
  const { locale, page } = await params;
  const t = getDictionary(locale as Locale);
  const p = t.pages[page as Page];
  if (!p) return {};
  const url = `/${locale}/${page}`;
  return {
    title: p.seoTitle,
    description: p.seo,
    alternates: { canonical: url, languages: { "nb-NO": `/no/${page}`, en: `/en/${page}`, "x-default": `/no/${page}` } },
    openGraph: {
      type: "website",
      siteName: t.meta.brand,
      title: `${p.seoTitle} | ${t.meta.brand}`,
      description: p.seo,
      url,
      locale: locale === "no" ? "nb_NO" : "en_US",
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: t.meta.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: `${p.seoTitle} | ${t.meta.brand}`, description: p.seo, images: [`/${locale}/twitter-image`] },
  };
}

export default async function ContentPage({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = (await params) as { locale: Locale; page: Page };
  const t = getDictionary(locale);
  const p = t.pages[page];
  if (!p) notFound();
  const date = new Date(site.legalUpdated).toLocaleDateString(locale === "no" ? "nb-NO" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
  const isLegal = legal.includes(page);
  const headerImg = ({ installation: "install", about: "town", reseller: "shop" } as const)[page as "installation" | "about" | "reseller"];
  const wide = page === "installation" || page === "contact" || !!headerImg;

  return (
    <div className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(pageGraph(locale, page, p.title, p.seo, t.crumbHome))} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(0,64,180,.14),transparent)]" />
      <section className={`relative mx-auto px-5 pb-28 pt-36 ${wide ? "max-w-6xl" : "max-w-3xl"}`}>
        <div className={headerImg ? "grid items-center gap-10 lg:grid-cols-[1fr_1fr]" : ""}>
          <header className={wide ? "max-w-2xl" : ""}>
            <h1 className="rise text-4xl font-semibold tracking-tightest text-fg sm:text-5xl">{p.title}</h1>
            <p className="rise lead mt-5" style={{ ["--d" as string]: "150ms" }}>{p.intro.replace("{date}", date)}</p>
          </header>
          {headerImg && (
            <div className="rise relative aspect-[4/3] overflow-hidden rounded-2xl border border-line" style={{ ["--d" as string]: "250ms" }}>
              <Image src={img[headerImg]} alt={t.images[headerImg]} fill priority placeholder="blur" sizes="(min-width: 1024px) 560px, 100vw" className="kenburns object-cover" />
            </div>
          )}
        </div>

        {page === "installation" && <div className="mt-14"><InstallGuide t={t.install} helpHref={`/${locale}/contact`} /></div>}

        {page === "contact" && (
          <div className="mt-14 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <ContactForm t={t.contactForm} />
            <aside className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
                <Image src={img.support} alt={t.images.support} fill placeholder="blur" sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" />
              </div>
              <div className="card p-6">
                <p className="text-sm text-muted">{t.contactForm.or}</p>
                <a href={`mailto:${site.email}`} className="mt-2 block text-lg font-medium text-fg hover:text-accent-hi">{site.email}</a>
                {site.whatsapp && <a href={waHref({ locale, intro: t.pricing.waHelp, button: "WhatsApp", path: `/${locale}/contact` })} className="btn-ghost mt-4 w-full">WhatsApp</a>}
                <p className="mt-4 text-sm text-muted">{site.responseTime[locale]}</p>
              </div>
              {site.company.legalName && (
                <div className="card p-6 text-sm leading-relaxed text-muted">
                  <p className="font-medium text-fg">{site.company.legalName}</p>
                  {site.company.orgNumber && <p>{t.footer.orgnr} {site.company.orgNumber}</p>}
                  {site.company.address && <p>{site.company.address}</p>}
                </div>
              )}
            </aside>
          </div>
        )}

        {p.sections.length > 0 && (
          <div className={`mt-14 ${isLegal ? "space-y-10" : "grid gap-4 sm:grid-cols-2"}`}>
            {p.sections.map((s) =>
              isLegal ? (
                <section key={s.h}>
                  <h2 className="text-lg font-semibold text-fg">{s.h}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{s.p}</p>
                </section>
              ) : (
                <Reveal key={s.h} anim="scale" className="card spot p-7">
                  <h2 className="text-lg font-semibold text-fg">{s.h}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{s.p}</p>
                </Reveal>
              )
            )}
          </div>
        )}

        {page === "reseller" && (
          <div className="mt-10"><a href={`/${locale}/contact`} className="btn-primary">{t.nav.contact}</a></div>
        )}
        {isLegal && site.company.legalName && (
          <p className="mt-14 border-t border-line pt-6 text-sm text-muted">
            {site.company.legalName}{site.company.orgNumber && ` · ${t.footer.orgnr} ${site.company.orgNumber}`}{site.company.address && ` · ${site.company.address}`} · {site.email}
          </p>
        )}
      </section>
    </div>
  );
}
