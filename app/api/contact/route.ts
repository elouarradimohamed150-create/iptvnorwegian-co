import { NextResponse } from "next/server";
import { site } from "@/lib/site";

// Sends contact-form messages by email through Resend (https://resend.com).
// Without RESEND_API_KEY the client falls back to opening the user's email app.
const hits = new Map<string, number[]>();
const LIMIT = 5, WINDOW = 10 * 60 * 1000;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ fallback: true }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW);
  if (recent.length >= LIMIT) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  hits.set(ip, [...recent, now]);

  let b: Record<string, string>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  if (b.website) return NextResponse.json({ ok: true }); // honeypot: silently drop bots

  const name = (b.name || "").trim().slice(0, 100);
  const email = (b.email || "").trim().slice(0, 200);
  const topic = (b.topic || "").trim().slice(0, 60);
  const device = (b.device || "").trim().slice(0, 100);
  const message = (b.message || "").trim().slice(0, 5000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || `${site.name} <noreply@${site.domain}>`,
      to: [process.env.CONTACT_TO || site.email],
      reply_to: email,
      subject: `[${topic || "Kontakt"}] ${name}`,
      html: `<p><b>Navn:</b> ${esc(name)}<br><b>E-post:</b> ${esc(email)}<br><b>Emne:</b> ${esc(topic)}<br><b>Enhet:</b> ${esc(device)}</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
    }),
  });
  if (!res.ok) {
    console.error("resend error", res.status, await res.text());
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
