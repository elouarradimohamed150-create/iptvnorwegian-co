import { site } from "@/lib/site";

export default function PaymentBadges({ className = "" }: { className?: string }) {
  if (!site.payments.length) return null;
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {site.payments.map((p) => (
        <li key={p} className="rounded-md border border-line bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-fg/80">{p}</li>
      ))}
    </ul>
  );
}
