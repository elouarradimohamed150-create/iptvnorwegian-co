import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const pages: { path: string; priority: number; freq: "weekly" | "monthly" | "yearly" }[] = [
  { path: "", priority: 1, freq: "weekly" },
  { path: "/installation", priority: 0.8, freq: "monthly" },
  { path: "/contact", priority: 0.6, freq: "monthly" },
  { path: "/about", priority: 0.5, freq: "monthly" },
  { path: "/reseller", priority: 0.5, freq: "monthly" },
  { path: "/terms", priority: 0.2, freq: "yearly" },
  { path: "/refund", priority: 0.2, freq: "yearly" },
  { path: "/privacy", priority: 0.2, freq: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const lastModified = new Date(site.legalUpdated);
  return pages.flatMap(({ path, priority, freq }) =>
    (["no", "en"] as const).map((l) => ({
      url: `${base}/${l}${path}`,
      lastModified,
      changeFrequency: freq,
      priority: l === "no" ? priority : Math.round(priority * 0.8 * 10) / 10,
      alternates: { languages: { "nb-NO": `${base}/no${path}`, en: `${base}/en${path}`, "x-default": `${base}/no${path}` } },
    }))
  );
}
