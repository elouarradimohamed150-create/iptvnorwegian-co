"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { waHref } from "@/lib/site";
import Logo from "./Logo";

export default function Navbar({ locale, t, trialMsg }: { locale: Locale; t: Record<string, string>; trialMsg: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { href: `/${locale}#pricing`, label: locale === "no" ? "Priser" : "Pricing" },
    { href: `/${locale}/installation`, label: t.installation },
    { href: `/${locale}/reseller`, label: t.reseller },
    { href: `/${locale}/contact`, label: t.contact },
  ];
  const other = locale === "no" ? "en" : "no";
  const otherHref = pathname.replace(/^\/(no|en)/, `/${other}`);
  const solid = scrolled || open;
  const tryHref = waHref({ locale, intro: trialMsg, button: t.cta, path: pathname });

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
        <Link href={`/${locale}`}><Logo /></Link>

        <ul className="hidden items-center gap-8 text-sm text-muted md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={`transition hover:text-fg ${pathname === l.href ? "text-fg" : ""}`}>{l.label}</Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link href={otherHref} className="hidden rounded-full px-3 py-1.5 text-xs font-medium uppercase text-muted transition hover:text-fg sm:block">{other}</Link>
          <a href={tryHref} className="btn-primary hidden !px-4 !py-2 !text-sm sm:inline-flex">{t.cta}</a>
          <button onClick={() => setOpen((v) => !v)} aria-label="Menu" aria-expanded={open}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full md:hidden">
            <span className={`h-px w-5 bg-fg transition ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`h-px w-5 bg-fg transition ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      <div className={`grid transition-all duration-300 md:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0 overflow-hidden">
          <ul className="space-y-1 px-5 pb-6 pt-2">
            {links.map((l) => (
              <li key={l.href}><Link href={l.href} className="block py-3 text-lg text-fg">{l.label}</Link></li>
            ))}
            <li className="flex items-center gap-3 pt-4">
              <a href={tryHref} className="btn-primary flex-1">{t.cta}</a>
              <Link href={otherHref} className="btn-ghost uppercase">{other}</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
