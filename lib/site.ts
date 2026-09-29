// ─────────────────────────────────────────────────────────────
// Site-wide settings. Everything the site shows about your business
// lives here. Empty values hide the related UI automatically.
// ─────────────────────────────────────────────────────────────
export const site = {
  name: "IPTV Norwegian",
  domain: "iptvnorwegian.co", // shown to visitors (share image, text)
  // The one address Google should index. Must match the primary domain in Vercel
  // (Vercel redirects iptvnorwegian.co → www.iptvnorwegian.co). Used for sitemap,
  // canonical/hreflang links, robots.txt, structured data and WhatsApp page links.
  url: "https://www.iptvnorwegian.co",
  // Taken from the old site. Consider a support@iptvnorwegian.co mailbox later for a more professional look.
  email: "goldengateiptv@gmail.com",

  // International format without "+" or spaces, e.g. "4712345678". Empty hides WhatsApp.
  whatsapp: "212707711512",

  // Shown on the contact page and in the footer. Only promise what you can keep.
  responseTime: { no: "Vi svarer vanligvis innen noen timer.", en: "We usually reply within a few hours." },

  // Legal company details (required for Norwegian web shops). Empty hides them.
  company: {
    legalName: "", // e.g. "Norwegian Stream AS"
    orgNumber: "", // e.g. "123 456 789"
    address: "", // e.g. "Storgata 1, 0155 Oslo"
  },

  // Payment methods you actually accept. Shown under pricing and in the footer.
  payments: ["Visa", "Mastercard", "Apple Pay", "Google Pay"],

  // Link to a real status page (e.g. BetterStack, Instatus). Empty hides the status indicator.
  statusUrl: "",

  // 12-month offer popup. Use a REAL end date: the countdown is the same for every
  // visitor, never resets, and the popup hides itself automatically after this moment.
  // Set enabled: false to switch the popup off.
  offer: {
    enabled: true,
    planIndex: 4, // index in messages → pricing.plans (4 = 12 måneder)
    endsAt: "2026-10-31T23:59:59+01:00",
    delayMs: 12000, // show after 12 s (or earlier if the visitor scrolls past ~45 % of the page)
    snoozeDays: 3, // after "No thanks", don't show again for this many days
  },

  // Date shown as "last updated" on the legal pages.
  legalUpdated: "2026-09-28",

  // Trustpilot (or similar) profile URL. Empty hides the link.
  reviewsUrl: "",
};

export function contactHref(message?: string) {
  if (site.whatsapp) {
    const text = message ? `?text=${encodeURIComponent(message)}` : "";
    return `https://wa.me/${site.whatsapp}${text}`;
  }
  // Email fallback: first line as subject, full message as body.
  if (!message) return `mailto:${site.email}`;
  const subject = message.split("\n")[0];
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

/**
 * WhatsApp link whose message tells you what the customer wants,
 * which button they pressed and which page/section they were on.
 *   Hei! Jeg vil bestille 6 måneder – 800 kr.
 *
 *   Knapp: Bestill nå
 *   Side: https://iptvnorwegian.co/no#pricing
 */
export function waHref({ locale, intro, button, path }: { locale: string; intro: string; button: string; path: string }) {
  const l = locale === "en" ? { b: "Button", p: "Page" } : { b: "Knapp", p: "Side" };
  return contactHref(`${intro}\n\n${l.b}: ${button}\n${l.p}: ${site.url}${path}`);
}
