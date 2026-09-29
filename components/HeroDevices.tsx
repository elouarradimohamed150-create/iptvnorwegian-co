// Product mockup: a TV showing a programme guide (EPG) and a phone playing a stream.
// Generic channel and show names only, no third-party content.
type Row = { ch: string; progs: { t: string; w: number; live?: boolean }[] };

const data: Record<string, { now: string; rows: Row[]; phone: { title: string; sub: string } }> = {
  no: {
    now: "Nå",
    rows: [
      { ch: "Nyheter", progs: [{ t: "Nyhetsmorgen", w: 38, live: true }, { t: "Været", w: 14 }, { t: "Debatt", w: 48 }] },
      { ch: "Sport 1", progs: [{ t: "Fotball: direkte", w: 56, live: true }, { t: "Studio", w: 44 }] },
      { ch: "Sport 2", progs: [{ t: "Håndball", w: 44, live: true }, { t: "Sykkel", w: 56 }] },
      { ch: "Film", progs: [{ t: "Kveldsfilm", w: 70, live: true }, { t: "Thriller", w: 30 }] },
      { ch: "Dokumentar", progs: [{ t: "Nordlys", w: 30, live: true }, { t: "Havet", w: 36 }, { t: "Fjellet", w: 34 }] },
      { ch: "Barn", progs: [{ t: "Tegnefilm", w: 46, live: true }, { t: "Eventyr", w: 54 }] },
    ],
    phone: { title: "Fotball: direkte", sub: "Sport 1 · 2. omgang" },
  },
  en: {
    now: "Now",
    rows: [
      { ch: "News", progs: [{ t: "Morning News", w: 38, live: true }, { t: "Weather", w: 14 }, { t: "Debate", w: 48 }] },
      { ch: "Sport 1", progs: [{ t: "Football: live", w: 56, live: true }, { t: "Studio", w: 44 }] },
      { ch: "Sport 2", progs: [{ t: "Handball", w: 44, live: true }, { t: "Cycling", w: 56 }] },
      { ch: "Movies", progs: [{ t: "Evening Movie", w: 70, live: true }, { t: "Thriller", w: 30 }] },
      { ch: "Docs", progs: [{ t: "Northern Lights", w: 30, live: true }, { t: "The Sea", w: 36 }, { t: "Mountains", w: 34 }] },
      { ch: "Kids", progs: [{ t: "Cartoons", w: 46, live: true }, { t: "Fairy Tales", w: 54 }] },
    ],
    phone: { title: "Football: live", sub: "Sport 1 · 2nd half" },
  },
};

export default function HeroDevices({ locale, label }: { locale: string; label: string }) {
  const d = data[locale] ?? data.no;
  return (
    <div className="relative pb-10 pr-6 sm:pr-10" aria-hidden="true">
      <div className="absolute -inset-10 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,64,180,.25),transparent)]" />

      {/* TV */}
      <div className="rounded-[18px] border border-white/10 bg-[#081229] p-1.5 shadow-[0_40px_120px_-20px_rgba(0,0,0,.85)]">
        <div className="overflow-hidden rounded-[13px] bg-[#050d20]">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="live-dot h-2 w-2 rounded-full bg-accent" />
              <span className="text-[11px] font-semibold text-white/90">{label}</span>
            </div>
            <span className="font-mono text-[10px] text-white/60">20:00 · 20:30 · 21:00 · 21:30</span>
          </div>
          <div className="relative">
            <div className="now-line pointer-events-none absolute bottom-0 top-0 z-10 w-px bg-accent/80 shadow-[0_0_8px_rgba(239,64,86,.9)]" style={{ left: "calc(104px + 18%)" }}>
              <span className="absolute -left-3 -top-0 rounded bg-accent px-1 text-[9px] font-semibold text-white">{d.now}</span>
            </div>
            {d.rows.map((r, i) => (
              <div key={r.ch} className={`flex items-stretch border-b border-white/[0.04] ${i === 1 ? "bg-white/[0.03]" : ""}`}>
                <div className="flex w-[104px] shrink-0 items-center gap-2 border-r border-white/[0.04] px-3 py-2.5">
                  <span className={`flex h-5 w-5 items-center justify-center rounded text-[8px] font-bold ${i === 1 ? "bg-accent text-white" : "bg-white/10 text-white/70"}`}>{r.ch.slice(0, 2).toUpperCase()}</span>
                  <span className="truncate text-[10px] font-medium text-white/70">{r.ch}</span>
                </div>
                <div className="flex flex-1 gap-1 p-1">
                  {r.progs.map((p) => (
                    <div key={p.t} style={{ width: `${p.w}%` }}
                      className={`truncate rounded-md px-2 py-1.5 text-[10px] ${p.live ? (i === 1 ? "glow-row bg-accent/90 text-white" : "bg-white/[0.08] text-white/85") : "bg-white/[0.03] text-white/65"}`}>
                      {p.t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto h-2.5 w-1/4 rounded-b-lg bg-[#10204a]" />

      {/* Phone */}
      <div className="float absolute bottom-0 right-0 w-[34%] min-w-[130px] rounded-[22px] border border-white/10 bg-[#081229] p-1.5 shadow-[0_30px_80px_-10px_rgba(0,0,0,.9)]">
        <div className="overflow-hidden rounded-[17px] bg-[#050d20]">
          <div className="relative aspect-[16/10] bg-gradient-to-br from-[#1a6b3a] via-[#0f4a28] to-[#0a2a17]">
            <div className="absolute inset-x-[12%] top-1/2 h-px bg-white/25" />
            <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[8px] font-semibold text-white">
              <span className="live-dot h-1 w-1 rounded-full bg-red-500" />LIVE
            </span>
          </div>
          <div className="space-y-1.5 p-2.5">
            <p className="truncate text-[10px] font-semibold text-white">{d.phone.title}</p>
            <p className="truncate text-[9px] text-white/50">{d.phone.sub}</p>
            <div className="h-1 overflow-hidden rounded-full bg-white/10"><div className="progress h-full w-2/3 bg-accent" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
