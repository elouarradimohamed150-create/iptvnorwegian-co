import { site } from "@/lib/site";
import no from "@/messages/no.json";
import en from "@/messages/en.json";

// llms.txt – a plain-language summary for AI assistants and answer engines (https://llmstxt.org).
export const dynamic = "force-static";

export function GET() {
  const base = `https://${site.domain}`;
  const plans = en.pricing.plans.filter((p) => Number(p.price) > 0).map((p) => `- ${p.name}: NOK ${p.price} (about NOK ${Math.round(Number(p.price) / (parseInt(p.period, 10) || 1))}/month)`).join("\n");
  const faq = en.faq.items.map((f) => `### ${f.q}\n${f.a}`).join("\n\n");
  const body = `# ${site.name} – IPTV Norge / IPTV Norway

> ${en.meta.description}

${en.guide.paras.join("\n\n")}

## Key facts
${en.guide.facts.map(([k, v]) => `- ${k}: ${v}`).join("\n")}

## Plans (prices in NOK, no automatic renewal)
- Free trial: 1 day
${plans}

## Contact
- Email: ${site.email}${site.whatsapp ? `\n- WhatsApp: +${site.whatsapp}` : ""}

## Pages
- [IPTV Norge (Norwegian)](${base}/no): ${no.meta.description}
- [IPTV Norway (English)](${base}/en): ${en.meta.description}
- [Installation guide](${base}/en/installation): ${en.pages.installation.seo}
- [Contact](${base}/en/contact)
- [Terms](${base}/en/terms) · [Refund policy](${base}/en/refund) · [Privacy](${base}/en/privacy)

## FAQ
${faq}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
