import { NextResponse } from "next/server";
import Stripe from "stripe";

export const revalidate = 600; // cache 10 min

// Real purchase activity from Stripe — no fake data, ever.
// Returns [] until the first sale, and the widget stays hidden.
export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET!);
    const list = await stripe.checkout.sessions.list({ limit: 10 });
    const paid = list.data.filter(s => s.payment_status === "paid");
    const now = Date.now() / 1000;
    const items = paid.slice(0, 8).map(s => {
      const created = (s.created || now) - now;
      const mins = Math.max(1, Math.round(-created / 60));
      const age = mins < 60 ? `${mins}m ago` : mins < 1440 ? `${Math.round(mins / 60)}h ago` : `${Math.round(mins / 1440)}d ago`;
      const country = s.customer_details?.address?.country || null;
      const acc = parseInt((s.metadata?.accounts as string) || "1");
      const plan = acc >= 4 ? "Team" : "Pro";
      return { plan, age, country };
    });
    return NextResponse.json({ sales: items, total: paid.length });
  } catch {
    return NextResponse.json({ sales: [], total: 0 });
  }
}
