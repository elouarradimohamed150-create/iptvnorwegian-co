import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { locales, type Locale, getDictionary } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactButton from "@/components/ContactButton";
import Analytics from "@/components/Analytics";
import Spotlight from "@/components/Spotlight";
import OfferPopup from "@/components/OfferPopup";
import { site } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });


export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s | ${t.meta.brand}` },
    description: t.meta.description,
    applicationName: t.meta.brand,
    keywords: locale === "no"
      ? ["IPTV Norge", "IPTV Norway", "IPTV abonnement", "IPTV Norge pris", "norsk IPTV", "IPTV Smart TV", "IPTV gratis prøveperiode"]
      : ["IPTV Norway", "IPTV Norge", "IPTV subscription Norway", "Norwegian IPTV", "IPTV Smart TV Norway", "IPTV free trial"],
    alternates: { canonical: `/${locale}`, languages: { "nb-NO": "/no", en: "/en", "x-default": "/no" } },
    openGraph: {
      type: "website",
      siteName: t.meta.brand,
      title: t.meta.title,
      description: t.meta.description,
      url: `/${locale}`,
      locale: locale === "no" ? "nb_NO" : "en_US",
      alternateLocale: locale === "no" ? ["en_US"] : ["nb_NO"],
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
    other: { "geo.region": "NO", "geo.placename": "Norway", "content-language": locale === "no" ? "nb-NO" : "en" },
    category: "entertainment",
  };
}

export const viewport = { themeColor: "#030a1a" };

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const t = getDictionary(locale);
  return (
    <html lang={locale === "no" ? "nb" : "en"} className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <div className="scroll-progress" aria-hidden="true" />
        <Spotlight />
        <Navbar locale={locale} t={t.nav} trialMsg={t.pricing.waTrial} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} t={t.footer} nav={t.nav} />
        <ContactButton label={t.nav.contact} locale={locale} helpMsg={t.pricing.waHelp} />
        <OfferPopup t={t.offer} plan={t.pricing.plans[site.offer.planIndex]} monthlyPrice={Number(t.pricing.plans[1].price)} locale={locale} />
        <Analytics t={t.cookie} privacyHref={`/${locale}/privacy`} />
      </body>
    </html>
  );
}
