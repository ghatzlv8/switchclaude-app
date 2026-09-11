// SwitchClaude Electron shell — macOS / Windows / Linux, one codebase.
// Profiles are isolated per account; switching = relaunch Claude with that profile.
// License: Settings → License → POST https://switchclaude.com/api/validate {key}
// Key is saved locally and cached for 7 days for offline use.
const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

function deviceId() {
  try {
    return require("node-machine-id").machineIdSync().slice(0, 64);
  } catch {
    return (os.hostname() + ":" + os.userInfo().username).slice(0, 64);
  }
}

const API = "https://switchclaude.com/api/validate";
const STORE = process.env.SWITCHCLAUDE_STORE || path.join(os.homedir(), "claude-switcher");
const PROFILES = path.join(STORE, "profiles.json");
const LICENSE_FILE = path.join(STORE, "license.json");
const OFFLINE_DAYS = 7;

// ---------- store ----------
function loadProfiles() {
  try { return JSON.parse(fs.readFileSync(PROFILES, "utf8")); }
  catch { return { active: null, accounts: [] }; }
}
function saveProfiles(p) {
  fs.mkdirSync(STORE, { recursive: true });
  fs.writeFileSync(PROFILES, JSON.stringify(p, null, 2));
}
function dataDir(id) { return path.join(STORE, "profiles", id); }

function loadLicense() {
  try { return JSON.parse(fs.readFileSync(LICENSE_FILE, "utf8")); }
  catch { return null; }
}
function saveLicense(lic) {
  fs.mkdirSync(STORE, { recursive: true });
  fs.writeFileSync(LICENSE_FILE, JSON.stringify(lic, null, 2));
}
function isFresh(lic) {
  if (!lic || !lic.validatedAt) return false;
  return Date.now() - lic.validatedAt < OFFLINE_DAYS * 864e5;
}

// ---------- license ----------
async function activateLicense(key) {
  key = (key || "").trim();
  const device = deviceId();
  try {
    const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, deviceId: device }) });
    const j = await r.json();
    if (j.valid) {
      const lic = { key, accounts: j.accounts || 0, deviceId: device, validatedAt: Date.now() };
      saveLicense(lic);
      return { ok: true, accounts: lic.accounts, offline: false };
    }
    return { ok: false, error: j.message || "Invalid key." };
  } catch {
    // Offline: accept the stored key if its cache is still fresh.
    const stored = loadLicense();
    if (stored && stored.key === key && isFresh(stored)) {
      return { ok: true, accounts: stored.accounts, offline: true };
    }
    return { ok: false, error: "No connection — and no fresh cached license." };
  }
}

function licenseStatus() {
  const lic = loadLicense();
  if (lic && isFresh(lic)) return { plan: lic.accounts > 0 ? "pro" : "free", accounts: lic.accounts, offlineOk: true };
  return { plan: "free", accounts: 0, offlineOk: false };
}

function maxAccounts() {
  const s = licenseStatus();
  return 1 + (s.plan === "pro" ? s.accounts : 0);
}

// ---------- claude ----------
function claudeBinary() {
  if (process.platform === "darwin") return "/Applications/Claude.app/Contents/MacOS/Claude";
  if (process.platform === "win32") return path.join(process.env.LOCALAPPDATA || "", "AnthropicClaude", "Claude.exe");
  return "claude"; // linux: PATH or AppImage companion
}

function launchProfile(id) {
  const bin = claudeBinary();
  const p = spawn(bin, [`--user-data-dir=${dataDir(id)}`], { detached: true, stdio: "ignore" });
  p.unref();
}

function killClaude() {
  try {
    if (process.platform === "darwin") spawn("pkill", ["-x", "Claude"]);
    else if (process.platform === "win32") spawn("taskkill", ["/IM", "Claude.exe", "/F"]);
    else spawn("pkill", ["-f", "Claude"]);
  } catch {}
}

function switchTo(id) {
  killClaude();
  setTimeout(() => {
    launchProfile(id);
    const s = loadProfiles(); s.active = id; saveProfiles(s);
    buildTray();
    pushState();
  }, 1200);
}

function addAccount() {
  const s = loadProfiles();
  if (s.accounts.length >= maxAccounts()) {
    return { ok: false, error: `Limit reached (${maxAccounts()} account${maxAccounts() > 1 ? "s" : ""}). Add a license for more.` };
  }
  const id = `acc-${Date.now().toString(36)}`;
  const label = `Account ${s.accounts.length + 1}`;
  fs.mkdirSync(dataDir(id), { recursive: true });
  s.accounts.push({ id, label });
  s.active = id;
  saveProfiles(s);
  // Kill first: otherwise the OS reuses the already-running Claude window
  // and the login would land in the wrong account instead of the new profile.
  killClaude();
  setTimeout(() => {
    launchProfile(id); // opens empty Claude → user logs in once, saved in this profile
    buildTray();
    pushState();
  }, 1200);
  return { ok: true, id, label };
}

// ---------- window / tray ----------
let tray = null;
let win = null;

function state() {
  const s = loadProfiles();
  const lic = licenseStatus();
  return { accounts: s.accounts, active: s.active, plan: lic.plan, extra: lic.accounts, max: maxAccounts() };
}
function pushState() {
  if (win && !win.isDestroyed()) win.webContents.send("state", state());
}

function buildTray() {
  const st = state();
  const items = st.accounts.map(a => ({
    label: `${a.id === st.active ? "● " : ""}${a.label}`,
    click: () => switchTo(a.id),
  }));
  items.push({ type: "separator" });
  items.push({ label: st.plan === "pro" ? `SwitchClaude Pro (${st.max} accounts)` : "SwitchClaude Free (1 account)", enabled: false });
  items.push({ label: "Open SwitchClaude", click: () => win && win.show() });
  items.push({ label: "Enter license…", click: () => { win && win.show(); win && win.webContents.send("focus-license"); } });
  items.push({ label: "Quit", click: () => app.quit() });
  if (!tray) {
    tray = new Tray(nativeImage.createEmpty());
    tray.setTitle("Claude ⇄");
    tray.setToolTip("SwitchClaude");
  }
  tray.setContextMenu(Menu.buildFromTemplate(items));
}

function createWindow() {
  win = new BrowserWindow({
    width: 440, height: 720, show: false, center: true,
    webPreferences: { preload: path.join(__dirname, "preload.js") },
  });
  win.webContents.on("console-message", (_, level, message, line, source) => {
    try { fs.appendFileSync(path.join(os.tmpdir(), "sc-render.log"), `[${level}] ${source}:${line} ${message}\n`); } catch {}
  });
  win.loadFile(path.join(__dirname, "index.html"));
  win.webContents.on("did-finish-load", pushState);
  win.on("close", e => { if (!app.quitting) { e.preventDefault(); win.hide(); } });
}

ipcMain.handle("license:activate", (_, key) => activateLicense(key).then(r => { buildTray(); pushState(); return r; }));
ipcMain.handle("license:status", () => licenseStatus());
ipcMain.handle("accounts:list", () => state());
ipcMain.handle("accounts:add", () => addAccount());
ipcMain.handle("accounts:switch", (_, id) => { switchTo(id); return { ok: true }; });
function profileStats(id) {
  // Read-only scan: counts + latest activity per account-UUID dir.
  const base = path.join(dataDir(id), "local-agent-mode-sessions");
  const out = [];
  let dirs = [];
  try { dirs = fs.readdirSync(base); } catch { return out; }
  for (const acct of dirs) {
    let files = [];
    try {
      const subs = fs.readdirSync(path.join(base, acct));
      for (const s of subs) {
        try {
          const m = fs.readdirSync(path.join(base, acct, s)).filter(f => f.startsWith("local_") && f.endsWith(".json"));
          for (const f of m) files.push(path.join(base, acct, s, f));
        } catch {}
      }
    } catch {}
    let latest = 0, n = 0;
    for (const f of files.slice(0, 5000)) {
      try {
        const d = JSON.parse(fs.readFileSync(f, "utf8"));
        n++;
        const la = d.lastActivityAt;
        if (typeof la === "number" && la > latest) latest = la;
      } catch {}
    }
    if (n) out.push({ account: acct.slice(0, 8), sessions: n, latest });
  }
  return out;
}

function manifestRows(id) {
  const base = path.join(dataDir(id), "local-agent-mode-sessions");
  const rows = [];
  let dirs = [];
  try { dirs = fs.readdirSync(base); } catch { return rows; }
  for (const acct of dirs) {
    let subs = [];
    try { subs = fs.readdirSync(path.join(base, acct)); } catch { continue; }
    for (const s of subs) {
      let files = [];
      try { files = fs.readdirSync(path.join(base, acct, s)).filter(f => f.startsWith("local_") && f.endsWith(".json")); } catch { continue; }
      for (const f of files) {
        try {
          const d = JSON.parse(fs.readFileSync(path.join(base, acct, s, f), "utf8"));
          rows.push({
            last_activity: typeof d.lastActivityAt === "number" ? new Date(d.lastActivityAt).toISOString().slice(0, 16).replace("T", " ") : "",
            model: d.model || "", cwd: d.cwd || "", session: d.sessionId || "",
            status: d.isArchived ? "archived" : "", ts: d.lastActivityAt || 0,
          });
        } catch {}
      }
    }
  }
  rows.sort((a, b) => b.ts - a.ts);
  return rows.map(({ ts, ...r }) => r);
}

ipcMain.handle("migrate:stats", (_, id) => profileStats(id));
ipcMain.handle("migrate:manifest", (_, id) => manifestRows(id));
ipcMain.handle("migrate:backup", (_, { id, dest }) => {
  // Timestamped recursive copy. Runs async — renderer polls migrate:backup-status.
  const src = dataDir(id);
  const stamp = new Date().toISOString().slice(0, 10);
  const target = path.join(dest, `claude-backup-${id}-${stamp}`);
  try { fs.mkdirSync(target, { recursive: true }); } catch (e) { return { ok: false, error: String(e.message || e) }; }
  const cp = spawn(process.platform === "win32" ? "xcopy" : "cp",
    process.platform === "win32" ? [src, target + "\\", "/E", "/I", "/Y"] : ["-R", src + "/", target + "/"],
    { stdio: "ignore" });
  backupJobs[target] = cp;
  cp.on("close", code => { backupJobs[target] = code === 0 ? "done" : "error"; });
  return { ok: true, target };
});
const backupJobs = {};
ipcMain.handle("migrate:backup-status", (_, target) => {
  const j = backupJobs[target];
  if (j === "done") return { status: "done" };
  if (j === "error") return { status: "error" };
  return { status: "running" };
});
ipcMain.handle("accounts:rename", (_, { id, label }) => {
  label = (label || "").trim().slice(0, 60);
  if (!label) return { ok: false };
  const s = loadProfiles();
  const a = s.accounts.find(x => x.id === id);
  if (!a) return { ok: false };
  a.label = label;
  saveProfiles(s);
  buildTray();
  pushState();
  return { ok: true };
});

app.whenReady().then(() => {
  fs.mkdirSync(path.join(STORE, "profiles"), { recursive: true });
  createWindow();
  buildTray();
  // Show window on manual launch; stay in tray when auto-started at login.
  const s = loadProfiles();
  if (!app.getLoginItemSettings().wasOpenedAtLogin || s.accounts.length === 0) {
    win.center();
    win.show();
    win.focus();
  }
  // Silent revalidation: registers this machine, refreshes the 7-day cache.
  // Offline or failed → stored license stays untouched.
  const stored = loadLicense();
  if (stored && stored.key) {
    activateLicense(stored.key).then(() => { buildTray(); pushState(); }).catch(() => {});
  }
});
app.on("window-all-closed", () => {});
// Single instance: a second launch focuses the existing window instead of
// starting a parallel app (parallel instances corrupt the shared profile).
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => { if (win && !win.isDestroyed()) { win.center(); win.show(); win.focus(); } });
}
// Dock click (or Cmd+Tab + click) must always bring the window back —
// closing the window only hides it to the tray, it doesn't quit.
app.on("activate", () => { if (win && !win.isDestroyed()) { win.center(); win.show(); win.focus(); } });
