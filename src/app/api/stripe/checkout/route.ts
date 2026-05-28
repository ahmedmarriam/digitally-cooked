import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PRICES: Record<string, { amount: number; name: string }> = {
  starter: { amount: 4900, name: "Digitally Cooked — Starter Plan" },
  growth:  { amount: 9900, name: "Digitally Cooked — Growth Plan"  },
  agency:  { amount: 24900, name: "Digitally Cooked — Agency Plan" },
};

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2026-05-27.dahlia" });

  try {
    const { plan } = await request.json();
    const priceConfig = PRICES[plan as keyof typeof PRICES];

    if (!priceConfig) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const origin = request.headers.get("origin") ?? "https://digitallycookedai.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: priceConfig.name },
            unit_amount: priceConfig.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/signup?plan=${plan}&success=true`,
      cancel_url:  `${origin}/#pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}
