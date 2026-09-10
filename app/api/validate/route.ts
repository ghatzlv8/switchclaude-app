import { NextRequest, NextResponse } from "next/server";
import { verifyLicense } from "@/lib/license";

export async function POST(req: NextRequest) {
  const { key } = await req.json().catch(() => ({ key: "" }));
  const lic = typeof key === "string" ? verifyLicense(key) : null;
  return NextResponse.json({
    valid: !!lic,
    accounts: lic?.accounts ?? 0,
    product: "switchclaude",
  });
}

export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get("key") || "";
  const lic = verifyLicense(key);
  return NextResponse.json({ valid: !!lic, accounts: lic?.accounts ?? 0 });
}
