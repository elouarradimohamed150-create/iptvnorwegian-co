import { site } from "@/lib/site";

// Brand mark: a bold "N" (Norge / Norwegian) – white stems, red diagonal, navy tile.
// Source of truth: brand/logo-mark.svg (also used for app/icon.svg and the PNG icons).
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a3775" />
          <stop offset="1" stopColor="#061433" />
        </linearGradient>
        <linearGradient id="lm-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f04a5f" />
          <stop offset="1" stopColor="#c8102e" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#lm-bg)" />
      <rect x=".5" y=".5" width="63" height="63" rx="14.5" fill="none" stroke="#fff" strokeOpacity=".1" />
      <rect x="15.5" y="15" width="9" height="34" rx="2" fill="#fff" />
      <rect x="39.5" y="15" width="9" height="34" rx="2" fill="#fff" />
      <path d="M15.5 15.6c0-.3.3-.6.6-.6h7.6c.4 0 .7.2.9.5l23.4 33.1c.2.3 0 .4-.3.4h-7.9a1 1 0 0 1-.8-.4L15.6 16z" fill="url(#lm-red)" />
    </svg>
  );
}

export default function Logo() {
  const [a, ...rest] = site.name.split(" ");
  return (
    <span className="group flex items-center gap-2.5">
      <LogoMark className="h-8 w-8 transition duration-500 group-hover:rotate-[-6deg] group-hover:scale-105" />
      <span className="text-[16px] tracking-tight text-fg">
        <span className="font-extrabold">{a}</span>
        {rest.length > 0 && <span className="font-normal text-fg/60"> {rest.join(" ")}</span>}
      </span>
    </span>
  );
}
