import Reveal from "./Reveal";
import { site } from "@/lib/site";

// Add real reviews (with the customer's permission) to messages/*.json → testimonials.items:
// { "name": "Kari", "place": "Bergen", "rating": 5, "text": "…" }
type Review = { name: string; place?: string; rating?: number; text: string };

export default function Testimonials({ items }: { items: Review[] }) {
  return (
    <>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {items.map((r, i) => (
          <Reveal key={r.name + i} delay={(i % 3) * 80}>
            <figure className="card flex h-full flex-col p-7">
              <div className="text-accent-hi" aria-label={`${r.rating ?? 5}/5`}>{"★".repeat(r.rating ?? 5)}</div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-fg/90">“{r.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent-hi">{r.name[0]}</span>
                <span className="text-sm"><span className="block font-medium text-fg">{r.name}</span>{r.place && <span className="text-muted">{r.place}</span>}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      {site.reviewsUrl && (
        <p className="mt-8 text-center"><a href={site.reviewsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-fg">Trustpilot →</a></p>
      )}
    </>
  );
}
