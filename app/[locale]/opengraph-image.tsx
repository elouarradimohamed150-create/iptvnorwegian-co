import { ImageResponse } from "next/og";
import { getDictionary, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "IPTV Norge – IPTV Norway";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  const [a, b] = t.hero.title.split("–").map((s) => s.trim());
  const bg = `data:image/jpeg;base64,${(await readFile(join(process.cwd(), "assets/og-bg.jpg"))).toString("base64")}`;
  const logo = `data:image/svg+xml;base64,${(await readFile(join(process.cwd(), "brand/logo-mark.svg"))).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, backgroundImage: `linear-gradient(90deg, rgba(3,10,26,.97) 0%, rgba(3,10,26,.85) 50%, rgba(3,10,26,.35) 100%), url(${bg})`, backgroundSize: "cover", color: "#eceef3", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={60} height={60} alt="" />
          <div style={{ display: "flex", fontSize: 32 }}><span style={{ fontWeight: 800 }}>{site.name.split(" ")[0]}</span><span style={{ marginLeft: 10, opacity: 0.65 }}>{site.name.split(" ").slice(1).join(" ")}</span></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>{a}</div>
          {b && <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05, color: "#9aa1b2" }}>{b}</div>}
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 26, color: "#9aa1b2" }}>
          <div style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: "#c8102e", color: "white", fontWeight: 600 }}>{t.final.cta}</div>
          <div style={{ display: "flex", alignItems: "center" }}>{site.domain}</div>
        </div>
      </div>
    ),
    size
  );
}
