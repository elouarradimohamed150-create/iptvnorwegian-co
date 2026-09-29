"use client";
import { useState } from "react";
import Icon from "./Icon";

type Device = { icon: string; name: string; sub: string; steps: string[] };
type T = { choose: string; need: string; needs: string[]; help: string; helpCta: string; devices: Device[] };

export default function InstallGuide({ t, helpHref }: { t: T; helpHref: string }) {
  const [i, setI] = useState(0);
  const d = t.devices[i];
  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">{t.choose}</p>
        <div role="tablist" className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {t.devices.map((dev, j) => (
            <button key={dev.name} role="tab" aria-selected={i === j} onClick={() => setI(j)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${i === j ? "border-accent/60 bg-accent/10 text-fg" : "border-line text-muted hover:border-white/15 hover:text-fg"}`}>
              <Icon name={dev.icon} className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">{dev.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div key={i} className="card rise p-6 sm:p-10">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent-hi"><Icon name={d.icon} className="h-6 w-6" /></span>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-fg">{d.name}</h2>
            <p className="text-sm text-muted">{d.sub}</p>
          </div>
        </div>
        <ol className="mt-10 space-y-8">
          {d.steps.map((s, k) => (
            <li key={k} className="rise relative flex gap-5" style={{ ["--d" as string]: `${120 + k * 90}ms` }}>
              {k < d.steps.length - 1 && <span className="absolute left-4 top-10 h-[calc(100%-8px)] w-px bg-line" />}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-sm font-semibold text-fg">{k + 1}</span>
              <p className="pt-1 text-[15px] leading-relaxed text-muted">{s}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 rounded-xl border border-line bg-white/[0.02] p-5">
          <p className="text-sm font-medium text-fg">{t.need}</p>
          <ul className="mt-3 space-y-2">
            {t.needs.map((n) => (
              <li key={n} className="flex gap-2.5 text-sm text-muted"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-hi" />{n}</li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-sm text-muted">{t.help}</p>
          <a href={helpHref} className="btn-ghost !py-2 text-sm">{t.helpCta}</a>
        </div>
      </div>
    </div>
  );
}
