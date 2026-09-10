import { createHmac } from "crypto"

const PREFIX = "CLAUDE-SWITCHER-";

function secret(): string {
  const s = process.env.LICENSE_SECRET;
  if (!s) throw new Error("LICENSE_SECRET missing");
  return s;
}

export function signLicense(payload: { accounts: number; sid: string }): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("hex").slice(0, 16);
  return `${PREFIX}${body}.${sig}`;
}

export function verifyLicense(key: string): { accounts: number; sid: string } | null {
  if (!key.startsWith(PREFIX)) return null;
  const rest = key.slice(PREFIX.length);
  const dot = rest.lastIndexOf(".");
  if (dot < 0) return null;
  const body = rest.slice(0, dot);
  const sig = rest.slice(dot + 1);
  const expect = createHmac("sha256", secret()).update(body).digest("hex").slice(0, 16);
  if (sig !== expect) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof p.accounts !== "number" || typeof p.sid !== "string") return null;
    return p;
  } catch {
    return null;
  }
}
