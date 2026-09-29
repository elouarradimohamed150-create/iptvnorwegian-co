# iptvnorwegian.co

Next.js 16 · TypeScript · Tailwind CSS · Norwegian/English · Stripe Checkout

## Run locally

    npm install
    cp .env.example .env.local   # fill in what you have; everything is optional
    npm run dev                  # http://localhost:3000 → /no

## Where to change things

| What | File |
|---|---|
| Brand name, email, WhatsApp, company details, payment methods, status page, reviews link | `lib/site.ts` |
| All text, prices, FAQ, legal pages, installation steps | `messages/no.json`, `messages/en.json` |
| Real customer reviews | `testimonials.items` in the message files |
| Colours and font | `tailwind.config.ts` |
| Logo | `brand/logo-mark.svg` (master), `components/Logo.tsx`, `app/icon.svg` |
| 12-month offer popup (on/off, real end date) | `offer` in `lib/site.ts` |
| WhatsApp number, email | `lib/site.ts` (every WhatsApp message includes plan, price, button and page) |

Anything left empty in `lib/site.ts` is hidden automatically (company line, status
indicator, reviews link, WhatsApp button).

## Integrations (all optional, set in `.env.local` or your host)

| Variable | Enables | Without it |
|---|---|---|
| `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_CHECKOUT=stripe` | Real card checkout (Visa, Mastercard, Apple Pay, Google Pay) | "Order" opens WhatsApp with plan, price, button and page |
| `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` | Contact form sends email | Form opens visitor's email app |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Cookie-free analytics | No analytics |
| `NEXT_PUBLIC_GA_ID` | Google Analytics + cookie consent banner | No GA, no banner |
| `NEXT_PUBLIC_SITE_URL` | Correct Stripe return URLs | Uses request origin |

Note: Stripe and other payment providers review what you sell and may ask for proof
that you hold the rights to distribute the content.

## Before launch

- [ ] Company legal name, org. number and address in `lib/site.ts`
- [ ] Payment methods in `lib/site.ts` match what you actually accept
- [ ] Have a lawyer review the terms, refund and privacy pages (drafted for Norwegian law)
- [ ] Only advertise content you are licensed to distribute
- [ ] Add real reviews (with permission) and a status page URL if you have them
- [ ] Verify the domain in Resend so contact emails are delivered

## Deploy (Vercel)

    npx vercel login
    npx vercel --prod

Then add `iptvnorwegian.co` under Project → Settings → Domains, point DNS to the
records Vercel shows, and add the environment variables above under Settings →
Environment Variables. HTTPS is automatic.

## SEO & GEO

Target keywords: **IPTV Norge** (`/no`) and **IPTV Norway** (`/en`).

- Titles, descriptions, H1 and key H2s contain the keyword; density is kept natural (~1%).
- Structured data (JSON-LD): Organization, WebSite, WebPage, Service/Product with NOK offers, FAQPage, BreadcrumbList.
- Norway targeting: `nb-NO` hreflang + `x-default`, `lang="nb"`, NOK prices, `areaServed: Norway`, geo meta tags, Norwegian cities in copy.
- AI answer engines (GEO): `/llms.txt`, a "What is IPTV Norge?" definition + key-facts table, direct-answer FAQ, and AI crawlers explicitly allowed in `robots.txt`.
- `/` → `/no` is a permanent (308) redirect.

After launch:
1. Add the site to Google Search Console, verify with `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, and submit `https://iptvnorwegian.co/sitemap.xml`.
2. Do the same in Bing Webmaster Tools (it also feeds ChatGPT search and Copilot).
3. Check structured data with Google's Rich Results Test.
4. Build links and mentions from Norwegian sites; this is what moves rankings for competitive keywords.
