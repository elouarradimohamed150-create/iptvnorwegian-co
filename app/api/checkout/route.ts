import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDictionary, locales, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

// Creates a Stripe Checkout session for a plan.
// Prices come from the server-side dictionary, never from the client.
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ fallback: true }, { status: 503 });

  let body: { locale?: string; plan?: number };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }

  const locale = (locales as readonly string[]).includes(body.locale ?? "") ? (body.locale as Locale) : "no";
  const t = getDictionary(locale);
  const paid = t.pricing.plans.filter((p) => Number(p.price) > 0);
  const plan = paid[Number(body.plan)];
  if (!plan) return NextResponse.json({ error: "unknown_plan" }, { status: 400 });
  const price = Number(plan.price);

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const stripe = new Stripe(key);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: locale === "no" ? "nb" : "en",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "nok",
          unit_amount: price * 100,
          product_data: { name: `${site.name} – ${plan.name}` },
        },
      }],
      customer_creation: "always",
      billing_address_collection: "auto",
      metadata: { plan: plan.name, period: plan.period, locale },
      custom_text: {
        submit: {
          message: locale === "no"
            ? "Ved å betale ber du oss starte tjenesten med en gang. Du har fortsatt 14 dagers angrerett, og betaler da bare for dagene du har brukt."
            : "By paying, you ask us to start the service right away. You keep your 14-day right of withdrawal and only pay for the days used.",
        },
      },
      success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/checkout/cancel`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("stripe checkout error", err);
    return NextResponse.json({ error: "stripe_error" }, { status: 502 });
  }
}
