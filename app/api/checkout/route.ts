import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const SITE = "https://switchclaude.vercel.app";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams;
  const accounts = Math.min(10, Math.max(1, parseInt(q.get("accounts") || "1")));
  const stripe = new Stripe(process.env.STRIPE_SECRET!);
  const amount = accounts >= 4 ? 2900 : Math.round(accounts * 999);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: accounts >= 4 ? "SwitchClaude Team (up to 5 accounts)" : `SwitchClaude Pro (${accounts} extra account${accounts > 1 ? "s" : ""})`,
            description: "One-time payment. Lifetime updates.",
          },
        },
        quantity: 1,
      },
    ],
    metadata: { accounts: String(accounts >= 4 ? 4 : accounts), product: "switchclaude" },
    success_url: `${SITE}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE}/#pricing`,
  });
  return NextResponse.redirect(session.url!, 303);
}
