import { NextRequest, NextResponse } from "next/server";

const REPO = "https://github.com/ghatzlv8/switchclaude-app";
const TAG = "v1.0.0";
const FILES: Record<string, string> = {
  mac: "SwitchClaude-1.0.0-universal.dmg",
  win: "SwitchClaude.Setup.1.0.0.exe",
  linux: "SwitchClaude-1.0.0.AppImage",
};

// Redirect to the real binary. If the asset isn't published yet (CI still
// building), send the user to the releases page instead of a JSON blob.
export async function GET(req: NextRequest) {
  const platform = new URL(req.url).searchParams.get("platform") || "mac";
  const file = FILES[platform] ?? FILES.mac;
  const asset = `${REPO}/releases/download/${TAG}/${encodeURIComponent(file).replace(/%20/g, "%20")}`;
  try {
    const head = await fetch(asset, { method: "HEAD", redirect: "manual" });
    if (head.status === 200 || head.status === 302) {
      return NextResponse.redirect(asset, 302);
    }
  } catch {}
  return NextResponse.redirect(`${REPO}/releases/tag/${TAG}`, 302);
}
