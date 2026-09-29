import { site } from "./site";
import type { Locale } from "./i18n";

// JSON-LD structured data (schema.org) for Google rich results and AI search engines.
const base = `https://${site.domain}`;
const orgId = `${base}/#organization`;
const siteId = `${base}/#website`;

type Dict = {
  meta: { title: string; description: string; brand: string };
  pricing: { plans: { name: string; price: string; period: string }[] };
  faq: { items: { q: string; a: string }[] };
  devices: { list: string[] };
};

export function organization() {
  const c = site.company;
  return {
    "@type": "Organization",
    "@id": orgId,
    name: c.legalName || site.name,
    alternateName: ["IPTV Norge", "IPTV Norway", site.name],
    url: base,
    logo: { "@type": "ImageObject", url: `${base}/icon-512.png`, width: 512, height: 512 },
    email: site.email,
    ...(site.whatsapp && { telephone: `+${site.whatsapp}` }),
    ...(c.orgNumber && { vatID: c.orgNumber, taxID: c.orgNumber }),
    ...(c.address && { address: { "@type": "PostalAddress", streetAddress: c.address, addressCountry: "NO" } }),
    areaServed: [{ "@type": "Country", name: "Norway" }, { "@type": "Country", name: "Sweden" }, { "@type": "Country", name: "Denmark" }, { "@type": "Country", name: "Finland" }],
    contactPoint: [{
      "@type": "ContactPoint",
      contactType: "customer support",
      email: site.email,
      ...(site.whatsapp && { telephone: `+${site.whatsapp}` }),
      areaServed: "NO",
      availableLanguage: ["Norwegian", "English"],
    }],
    ...(site.reviewsUrl && { sameAs: [site.reviewsUrl] }),
  };
}

export function homeGraph(locale: Locale, t: Dict) {
  const url = `${base}/${locale}`;
  const lang = locale === "no" ? "nb-NO" : "en";
  const paid = t.pricing.plans.filter((p) => Number(p.price) > 0);
  const prices = paid.map((p) => Number(p.price));
  const monthly = paid.map((p) => Number(p.price) / (parseInt(p.period, 10) || 1));

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(),
      {
        "@type": "WebSite",
        "@id": siteId,
        url: base,
        name: t.meta.brand,
        alternateName: [site.name, "IPTV Norge", "IPTV Norway"],
        publisher: { "@id": orgId },
        inLanguage: ["nb-NO", "en"],
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: lang,
        isPartOf: { "@id": siteId },
        about: { "@id": `${url}#service` },
        dateModified: site.legalUpdated,
      },
      {
        "@type": ["Service", "Product"],
        "@id": `${url}#service`,
        name: t.meta.brand,
        description: t.meta.description,
        brand: { "@type": "Brand", name: site.name },
        provider: { "@id": orgId },
        serviceType: "IPTV",
        category: "IPTV subscription",
        areaServed: { "@type": "Country", name: "Norway" },
        audience: { "@type": "Audience", geographicArea: { "@type": "Country", name: "Norway" } },
        image: `${url}/opengraph-image`,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "NOK",
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: paid.length,
          availability: "https://schema.org/InStock",
          offers: paid.map((p, i) => ({
            "@type": "Offer",
            name: `${t.meta.brand} – ${p.name}`,
            price: p.price,
            priceCurrency: "NOK",
            availability: "https://schema.org/InStock",
            url: `${url}#pricing`,
            eligibleRegion: { "@type": "Country", name: "Norway" },
            priceSpecification: { "@type": "UnitPriceSpecification", price: Math.round(monthly[i]), priceCurrency: "NOK", unitCode: "MON", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" } },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: lang,
        mainEntity: t.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}

export function pageGraph(locale: Locale, slug: string, title: string, description: string, homeLabel: string) {
  const url = `${base}/${locale}/${slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: locale === "no" ? "nb-NO" : "en",
        isPartOf: { "@id": siteId },
        publisher: { "@id": orgId },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: homeLabel, item: `${base}/${locale}` },
          { "@type": "ListItem", position: 2, name: title, item: url },
        ],
      },
    ],
  };
}

export const ldScript = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
