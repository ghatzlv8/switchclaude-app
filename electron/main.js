// SwitchClaude Electron shell — macOS / Windows / Linux, one codebase.
// Profiles are isolated per account; switching = relaunch Claude with that profile.
// License: Settings → License → POST https://switchclaude.com/api/validate {key}
const { app, BrowserWindow, Tray, Menu, nativeImage, shell } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

const API = "https://switchclaude.com/api/validate";
const STORE = path.join(os.homedir(), "claude-switcher");
const PROFILES = path.join(STORE, "profiles.json");
const LICENSE_FILE = path.join(STORE, "license.key");

function loadProfiles() {
  try { return JSON.parse(fs.readFileSync(PROFILES, "utf8")); }
  catch { return { active: null, accounts: [] }; }
}
function saveProfiles(p) {
  fs.mkdirSync(STORE, { recursive: true });
  fs.writeFileSync(PROFILES, JSON.stringify(p, null, 2));
}
function dataDir(id) { return path.join(STORE, "profiles", id); }

function claudeBinary() {
  if (process.platform === "darwin") return "/Applications/Claude.app/Contents/MacOS/Claude";
  if (process.platform === "win32") return path.join(process.env.LOCALAPPDATA || "", "AnthropicClaude", "Claude.exe");
  return "claude"; // linux: PATH or AppImage companion
}

async function validateLicense(key) {
  try {
    const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key }) });
    const j = await r.json();
    return !!j.valid;
  } catch { return false; }
}

function switchTo(id) {
  const bin = claudeBinary();
  try {
    if (process.platform === "darwin") spawn("pkill", ["-x", "Claude"]);
    else if (process.platform === "win32") spawn("taskkill", ["/IM", "Claude.exe", "/F"]);
    else spawn("pkill", ["-f", "Claude"]);
  } catch {}
  setTimeout(() => {
    const p = spawn(bin, [`--user-data-dir=${dataDir(id)}`], { detached: true, stdio: "ignore" });
    p.unref();
    const s = loadProfiles(); s.active = id; saveProfiles(s);
    buildTray();
  }, 1200);
}

let tray = null;
let win = null;

function buildTray() {
  const s = loadProfiles();
  const items = s.accounts.map(a => ({
    label: `${a.id === s.active ? "● " : ""}${a.label}`,
    click: () => switchTo(a.id),
  }));
  items.push({ type: "separator" });
  items.push({ label: "Open SwitchClaude", click: () => win && win.show() });
  items.push({ label: "Enter license…", click: () => { win && win.show(); win && win.webContents.send("focus-license"); } });
  items.push({ label: "Quit", click: () => app.quit() });
  const menu = Menu.buildFromTemplate(items);
  if (!tray) {
    tray = new Tray(nativeImage.createEmpty());
    tray.setTitle("Claude ⇄");
    tray.setToolTip("SwitchClaude");
  }
  tray.setContextMenu(menu);
}

function createWindow() {
  win = new BrowserWindow({
    width: 420, height: 560, show: false,
    webPreferences: { preload: path.join(__dirname, "preload.js") },
  });
  win.loadFile(path.join(__dirname, "index.html"));
  win.on("close", e => { if (!app.quitting) { e.preventDefault(); win.hide(); } });
}

app.whenReady().then(() => {
  fs.mkdirSync(path.join(STORE, "profiles"), { recursive: true });
  createWindow();
  buildTray();
});
app.on("window-all-closed", () => {});
