import { NextRequest, NextResponse } from "next/server";
import { verifyLicense } from "@/lib/license";
import { checkDevice } from "@/lib/devices";

export async function POST(req: NextRequest) {
  const { key, deviceId } = await req.json().catch(() => ({ key: "", deviceId: "" }));
  const lic = typeof key === "string" ? verifyLicense(key) : null;
  if (!lic) return NextResponse.json({ valid: false, accounts: 0, product: "switchclaude" });

  const max = lic.accounts + 1; // primary device + one per extra account
  if (typeof deviceId === "string" && deviceId.length >= 8) {
    try {
      const d = await checkDevice(key, deviceId.slice(0, 128), max);
      if (!d.ok) {
        return NextResponse.json({
          valid: false, accounts: 0, product: "switchclaude",
          error: "device_limit",
          message: `This key is already active on ${d.devices} device(s) (max ${max}). Contact info@lv8.gr to reset.`,
        });
      }
    } catch {
      // registry hiccup → fail open, signature already verified
    }
  }
  return NextResponse.json({ valid: true, accounts: lic.accounts, product: "switchclaude" });
}

export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get("key") || "";
  const lic = verifyLicense(key);
  return NextResponse.json({ valid: !!lic, accounts: lic?.accounts ?? 0 });
}
