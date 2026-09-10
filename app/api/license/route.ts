import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { signLicense } from "@/lib/license";

// Called by /success?session_id=... — verifies the Stripe session is paid,
// then mints the HMAC-signed license key (stateless, no DB needed).
export async function GET(req: NextRequest) {
  const sid = new URL(req.url).searchParams.get("session_id") || "";
  if (!sid) return NextResponse.json({ error: "missing session" }, { status: 400 });
  const stripe = new Stripe(process.env.STRIPE_SECRET!);
  const s = await stripe.checkout.sessions.retrieve(sid);
  if (s.payment_status !== "paid") return NextResponse.json({ error: "not paid" }, { status: 402 });
  const accounts = parseInt((s.metadata?.accounts as string) || "1");
  const key = signLicense({ accounts, sid });
  return NextResponse.json({ license_key: key, accounts });
}
