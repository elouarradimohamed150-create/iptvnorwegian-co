export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <details key={i} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16px] font-medium text-fg">
            {item.q}
            <span className="relative h-4 w-4 shrink-0 text-muted">
              <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
              <span className="absolute left-1/2 top-0 h-4 w-px bg-current transition group-open:rotate-90" />
            </span>
          </summary>
          <p className="pb-6 pr-10 text-[15px] leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
