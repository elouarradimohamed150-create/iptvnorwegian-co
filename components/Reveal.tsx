"use client";
import { useEffect, useRef, type ReactNode } from "react";

type Anim = "up" | "scale" | "left" | "right" | "unveil";

// Content is visible by default (no-JS, crawlers, screenshots).
// On the client, only elements below the fold are hidden, then animated in when scrolled into view.
export default function Reveal({ children, delay = 0, className = "", anim = "up", as: Tag = "div" }: { children: ReactNode; delay?: number; className?: string; anim?: Anim; as?: "div" | "li" | "section" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    el.classList.add("reveal-hidden");
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.remove("reveal-hidden"); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    // @ts-expect-error polymorphic ref
    <Tag ref={ref} data-anim={anim} className={`reveal ${className}`} style={{ ["--d" as string]: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
