import { type Locale, getDictionary } from "@/lib/i18n";
import { site, waHref } from "@/lib/site";
import Icon from "@/components/Icon";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import HeroDevices from "@/components/HeroDevices";
import Image from "next/image";
import { Fragment } from "react";
import { img, type ImgKey } from "@/lib/images";
import Testimonials from "@/components/Testimonials";
import { homeGraph, ldScript } from "@/lib/schema";

function SectionHead({ eyebrow, title, text, center = true }: { eyebrow?: string; title: string; text?: string; center?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="h2 mt-3">{title}</h2>
      {text && <p className="lead mt-5">{text}</p>}
    </Reveal>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = getDictionary(locale);
  const [titleA, titleB] = t.hero.title.split("–").map((s) => s.trim());
  // Feature grid: image cards span two columns, text cards one.
  const layout: { icon: string; image?: ImgKey }[] = [
    { icon: "devices", image: "devices" }, { icon: "price" },
    { icon: "quality" }, { icon: "mobile", image: "train" },
    { icon: "speed", image: "stadium" }, { icon: "support" },
  ];

  const jsonLd = homeGraph(locale, t);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(jsonLd)} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <Image src={img.hero} alt={t.images.hero} fill priority placeholder="blur" sizes="100vw" className="kenburns object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-bg/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg/80 to-transparent" />
        {/* Abstract Nordic cross: white band with a red core, very faint */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_88%,#000,transparent)] hidden lg:block">
          <div className="draw-x absolute inset-x-0 top-[88%] flex h-[14px] items-center bg-white/[0.035]"><div className="h-[5px] w-full bg-accent/[0.22]" /></div>
          <div className="draw-y absolute inset-y-0 left-1/2 flex w-[14px] justify-center bg-white/[0.035]"><div className="h-full w-[5px] bg-accent/[0.22]" /></div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(60%_60%_at_70%_0%,rgba(0,64,180,.16),transparent)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 pb-24 pt-36 lg:grid-cols-[1.05fr_1fr] lg:pb-32 lg:pt-44">
          <div>
            <p className="rise inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs font-medium text-muted" style={{ ["--d" as string]: "0ms" }}>
              <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-hi opacity-75" /><span className="relative h-1.5 w-1.5 rounded-full bg-accent-hi" /></span> {t.hero.badges[0]}
            </p>
            <h1 className="mt-6 text-[44px] font-semibold leading-[1.02] tracking-tightest text-fg sm:text-6xl lg:text-[68px]">
              {titleA.split(" ").map((w, k) => <Fragment key={k}>{k > 0 && " "}<span className="word" style={{ ["--d" as string]: `${80 + k * 50}ms` }}>{w}</span></Fragment>)}{" "}
              {titleB && (
                <span className="block text-[#c5cde0]">
                  {titleB.split(" ").map((w, k) => <Fragment key={k}>{k > 0 && " "}<span className="word" style={{ ["--d" as string]: `${180 + k * 50}ms` }}>{w}</span></Fragment>)}
                </span>
              )}
            </h1>
            <p className="rise lead mt-6 max-w-lg" style={{ ["--d" as string]: "450ms" }}>{t.hero.subtitle}</p>
            <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "550ms" }}>
              <a href={waHref({ locale, intro: t.pricing.waTrial, button: t.final.cta, path: `/${locale}` })} className="btn-primary">{t.final.cta}</a>
              <a href="#pricing" className="btn-ghost">{t.hero.primary}</a>
            </div>
            <p className="rise mt-6 text-sm text-muted" style={{ ["--d" as string]: "650ms" }}>{t.hero.trust}</p>
          </div>
          <div className="rise" style={{ ["--d" as string]: "300ms" }}><HeroDevices locale={locale} label={t.hero.screen} /></div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-16 border-t border-line bg-surface/40 py-28">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead eyebrow={t.pricing.eyebrow} title={t.pricing.title} text={t.pricing.subtitle} />
          <Reveal className="mt-14"><Pricing t={t.pricing} /></Reveal>
        </div>
      </section>

      {/* Devices strip */}
      <section className="marquee-wrap border-y border-line">
        <div className="mx-auto flex max-w-6xl items-center gap-8 px-5 py-7">
          <p className="hidden shrink-0 text-sm text-muted md:block">{t.devices.title}</p>
          <div className="marquee-mask min-w-0 flex-1 overflow-hidden">
            <ul className="marquee flex w-max gap-12 text-sm font-medium text-fg/70" aria-label={t.devices.title}>
              {[...t.devices.list, ...t.devices.list].map((d, k) => (
                <li key={k} aria-hidden={k >= t.devices.list.length} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="h-1 w-1 rounded-full bg-accent-hi/70" />{d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What is IPTV Norge – definition + key facts (SEO/GEO) */}
      <section id="iptv-norge" className="mx-auto grid max-w-6xl scroll-mt-16 gap-12 px-5 py-28 lg:grid-cols-[1.2fr_1fr]">
        <Reveal anim="left">
          <p className="eyebrow">{t.guide.eyebrow}</p>
          <h2 className="h2 mt-3">{t.guide.title}</h2>
          <div className="mt-6 space-y-5">
            {t.guide.paras.map((para, i) => <p key={i} className="lead">{para}</p>)}
          </div>
        </Reveal>
        <Reveal delay={100} className="space-y-4">
          <Reveal anim="unveil" className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
            <Image src={img.family} alt={t.images.family} fill placeholder="blur" sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
          </Reveal>
          <div className="card spot overflow-hidden">
            <h3 className="border-b border-line px-6 py-4 text-sm font-medium text-fg">{t.guide.factsTitle}</h3>
            <dl className="divide-y divide-line">
              {t.guide.facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[140px_1fr] gap-4 px-6 py-3.5 text-sm transition-colors hover:bg-white/[0.03]">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      {/* Features bento */}
      <section className="mx-auto max-w-6xl px-5 py-28">
        <SectionHead eyebrow={t.reasons.eyebrow} title={t.reasons.title_alt} text={t.reasons.text} />
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {layout.map(({ icon, image }, i) => {
            const r = t.reasons.items.find((x) => x.icon === icon)!;
            return image ? (
              <Reveal key={icon} anim="scale" delay={(i % 3) * 100} className="md:col-span-2">
                <div className="card spot group relative flex h-full min-h-[320px] flex-col justify-end overflow-hidden transition duration-500 hover:border-white/20 md:justify-center">
                  <Image src={img[image]} alt={t.images[image as keyof typeof t.images]} fill placeholder="blur" sizes="(min-width: 768px) 760px, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/85 to-surface/10 md:bg-gradient-to-r md:from-surface md:via-surface/80 md:to-transparent" />
                  <div className="relative max-w-sm p-7 sm:p-8">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-bg/40 text-accent-hi backdrop-blur"><Icon name={r.icon} className="h-5 w-5" /></span>
                    <h3 className="mt-6 text-2xl font-semibold tracking-tight text-fg">{r.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-fg/80">{r.text}</p>
                  </div>
                </div>
              </Reveal>
            ) : (
              <Reveal key={icon} anim="scale" delay={(i % 3) * 100}>
                <div className="card spot group relative h-full overflow-hidden p-7 transition duration-500 hover:-translate-y-1 hover:border-white/20 sm:p-8">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white/5 text-accent-hi transition duration-500 group-hover:scale-110 group-hover:border-accent/40 group-hover:bg-accent/10"><Icon name={r.icon} className="h-5 w-5" /></span>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-fg">{r.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{r.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="steps" className="mx-auto max-w-6xl scroll-mt-16 px-5 py-28">
        <SectionHead eyebrow={t.steps.eyebrow} title={t.steps.title} />
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal anim="unveil" className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-line">
            <Image src={img.phone} alt={t.images.phone} fill placeholder="blur" sizes="(min-width: 1024px) 448px, 100vw" className="object-cover" />
          </Reveal>
          <ol className="space-y-10">
            {t.steps.items.map((s, i) => (
              <Reveal as="li" anim="right" key={s.title} delay={150 + i * 150} className="group flex gap-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-sm font-semibold text-accent-hi transition duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:text-white">0{i + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-fg">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Multi-device + Nordic */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 py-28 lg:grid-cols-2">
          <Reveal anim="left" className="card spot p-8 sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{t.multi.title}</h2>
            <p className="lead mt-4 !text-[15px]">{t.multi.text}</p>
            <ul className="mt-8 space-y-3">
              {t.multi.scenes.map((s, i) => (
                <li key={s} className="flex items-center gap-4 rounded-xl border border-line bg-white/[0.02] px-4 py-3.5 transition duration-300 hover:translate-x-1 hover:border-white/20">
                  <Icon name={["tv", "devices", "mobile"][i] ?? "tv"} className="h-5 w-5 text-accent-hi" />
                  <span className="text-[15px] text-fg">{s}</span>
                  <span className={`ml-auto h-2 w-2 rounded-full ${i === 0 ? "live-dot bg-green-400 shadow-[0_0_10px_rgba(74,222,128,.8)]" : "bg-white/15"}`} />
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal anim="right" delay={100} className="card spot relative overflow-hidden p-8 sm:p-10">
            <Image src={img.aurora} alt={t.images.aurora} fill placeholder="blur" sizes="(min-width: 1024px) 560px, 100vw" className="drift object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/75 to-surface/20" />
            <div className="relative pt-28 sm:pt-36">
            <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{t.nordic.title}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-fg/80">{t.nordic.text}</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {t.nordic.countries.map((c) => (
                <div key={c} className="rounded-xl border border-white/15 bg-bg/40 px-4 py-3.5 text-[15px] text-fg backdrop-blur">{c}</div>
              ))}
            </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Security */}
      <section className="border-t border-line bg-surface/40 py-28">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead title={t.security.title} text={t.security.text} />
          <div className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.security.items.map((s, i) => (
              <Reveal key={s.title} delay={i * 120} className="group">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white/5 transition duration-500 group-hover:-translate-y-1 group-hover:border-accent/40"><Icon name={s.icon} className="h-5 w-5 text-accent-hi" /></span>
                <h3 className="mt-4 font-semibold text-fg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (only when real reviews exist) */}
      {t.testimonials.items.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-28">
          <SectionHead title={t.testimonials.title} />
          <Testimonials items={t.testimonials.items} />
        </section>
      )}

      {/* FAQ */}
      <section id="faq" className="mx-auto grid max-w-6xl scroll-mt-16 gap-12 px-5 py-28 lg:grid-cols-[1fr_1.6fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead eyebrow={t.faq.eyebrow} title={t.faq.title} text={t.faq.text} center={false} />
          <Reveal className="mt-8"><a href={waHref({ locale, intro: t.pricing.waHelp, button: t.nav.contact, path: `/${locale}#faq` })} className="btn-ghost">{t.nav.contact}</a></Reveal>
        </div>
        <Reveal delay={100}><Faq items={t.faq.items} /></Reveal>
      </section>

      {/* Final CTA */}
      <section id="start" className="mx-auto max-w-6xl scroll-mt-16 px-5 pb-28">
        <Reveal anim="scale" className="card relative overflow-hidden px-8 py-16 text-center sm:py-24">
          <Image src={img.aurora} alt="" fill sizes="(min-width: 1152px) 1152px, 100vw" className="drift object-cover" />
          <div className="absolute inset-0 bg-bg/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-bg/40" />
          <div className="relative">
            <h2 className="h2">{t.final.title}</h2>
            <p className="lead mx-auto mt-4 max-w-md">{t.final.text}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a href={waHref({ locale, intro: t.pricing.waTrial, button: t.final.cta, path: `/${locale}#start` })} className="btn-primary">{t.final.cta}</a>
              <a href="#pricing" className="btn-ghost">{t.hero.primary}</a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
