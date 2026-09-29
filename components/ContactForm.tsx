"use client";
import { useState } from "react";
import { site } from "@/lib/site";

type T = { name: string; email: string; device: string; topic: string; topics: string[]; message: string; send: string; sending: string; sent: string; error: string };

const field = "w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[15px] text-fg placeholder:text-muted/60 outline-none transition focus:border-accent/70 focus:ring-4 focus:ring-accent/15";

export default function ContactForm({ t }: { t: T }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setState("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const out = await res.json().catch(() => ({}));
      if (out.ok) { setState("sent"); return; }
      if (out.fallback) {
        const body = `${data.message}\n\n— ${data.name} (${data.email})${data.device ? `\n${t.device}: ${data.device}` : ""}`;
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`[${data.topic}] ${data.name}`)}&body=${encodeURIComponent(body)}`;
        setState("idle");
        return;
      }
      setState("error");
    } catch { setState("error"); }
  }

  if (state === "sent") {
    return (
      <div className="card flex flex-col items-center p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15 text-green-400">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
        </span>
        <p className="mt-5 text-lg text-fg">{t.sent}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-6 sm:p-8">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block"><span className="mb-2 block text-sm text-fg">{t.name}</span><input required name="name" autoComplete="name" className={field} /></label>
        <label className="block"><span className="mb-2 block text-sm text-fg">{t.email}</span><input required type="email" name="email" autoComplete="email" className={field} /></label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-fg">{t.topic}</span>
          <select name="topic" className={`${field} appearance-none`} defaultValue={t.topics[0]}>
            {t.topics.map((o) => <option key={o} className="bg-surface">{o}</option>)}
          </select>
        </label>
        <label className="block"><span className="mb-2 block text-sm text-fg">{t.device}</span><input name="device" placeholder="Samsung TV, iPhone …" className={field} /></label>
      </div>
      <label className="block"><span className="mb-2 block text-sm text-fg">{t.message}</span><textarea required name="message" rows={5} minLength={5} className={`${field} resize-y`} /></label>
      {state === "error" && <p role="alert" className="text-sm text-red-400">{t.error}</p>}
      <button disabled={state === "sending"} className="btn-primary w-full disabled:opacity-70 sm:w-auto">
        {state === "sending" ? t.sending : t.send}
      </button>
    </form>
  );
}
