import { createHash } from "crypto";
import { get } from "@vercel/edge-config";

const EC_ID = "ecfg_rwusl2ksz5eg6cxgehblfw4fdfk3";
const TEAM = "team_Pb4qr1YdDn6EED53X8lurddA";

export function keyId(key: string): string {
  return "lic_" + createHash("sha256").update(key).digest("hex").slice(0, 32);
}

type Binding = { devices: string[]; max: number };

// Register deviceId for this key. Returns {ok, devices} or {ok:false, reason}.
export async function checkDevice(key: string, deviceId: string, max: number): Promise<{ ok: boolean; reason?: string; devices?: number }> {
  const id = keyId(key);
  let cur: Binding | null = null;
  try {
    cur = (await get<Binding>(id)) ?? null;
  } catch {
    // Edge Config unreachable → fail open (offline tolerance), app cache covers the rest.
    return { ok: true, devices: 1 };
  }
  const devices: string[] = cur?.devices ?? [];
  const limit = cur?.max ?? max;
  if (devices.includes(deviceId)) return { ok: true, devices: devices.length };
  if (devices.length >= limit) return { ok: false, reason: "device_limit", devices: devices.length };
  const next: Binding = { devices: [...devices, deviceId], max: limit };
  await writeBinding(id, next);
  return { ok: true, devices: next.devices.length };
}

async function writeBinding(id: string, b: Binding): Promise<void> {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) throw new Error("VERCEL_API_TOKEN missing");
  const r = await fetch(`https://api.vercel.com/v1/edge-config/${EC_ID}/items?teamId=${TEAM}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ items: [{ operation: "upsert", key: id, value: b }] }),
  });
  if (!r.ok) throw new Error(`edge-config write ${r.status}`);
}

export async function resetDevices(key: string): Promise<void> {
  await writeBinding(keyId(key), { devices: [], max: 0 });
}
