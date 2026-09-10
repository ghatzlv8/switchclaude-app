import { NextRequest, NextResponse } from "next/server"

const BUILDS: Record<string, { file: string; note: string }> = {
  mac: { file: "SwitchClaude-1.0.0.dmg", note: "macOS 12+ (Apple Silicon & Intel). Right-click → Open → Allow once." },
  win: { file: "SwitchClaude-Setup-1.0.0.exe", note: "Windows 10+. NSIS installer." },
  linux: { file: "SwitchClaude-1.0.0.AppImage", note: "Ubuntu 20+ / any distro. chmod +x then run." },
}

export async function GET(req: NextRequest) {
  const platform = new URL(req.url).searchParams.get("platform") || "mac"
  const b = BUILDS[platform] ?? BUILDS.mac
  return NextResponse.json({
    platform,
    file: b.file,
    note: b.note,
    license: "Paste your CLAUDE-SWITCHER-XXXX key in Settings → License to unlock extra accounts.",
    // Binaries ship via GitHub Releases in prod; this endpoint returns the manifest for the app auto-updater.
    releases: "https://github.com/switchclaude/app/releases/latest",
  })
}
