const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("api", {
  activate: (key) => ipcRenderer.invoke("license:activate", key),
  getState: () => ipcRenderer.invoke("accounts:list"),
  addAccount: () => ipcRenderer.invoke("accounts:add"),
  switchTo: (id) => ipcRenderer.invoke("accounts:switch", id),
  rename: (id, label) => ipcRenderer.invoke("accounts:rename", { id, label }),
  migStats: (id) => ipcRenderer.invoke("migrate:stats", id),
  migManifest: (id) => ipcRenderer.invoke("migrate:manifest", id),
  migBackup: (id) => ipcRenderer.invoke("migrate:backup", { id, dest: require("os").homedir() + "/claude-switcher/backups" }),
  migBackupStatus: (t) => ipcRenderer.invoke("migrate:backup-status", t),
  onState: (fn) => ipcRenderer.on("state", (_, s) => fn(s)),
  onFocusLicense: (fn) => ipcRenderer.on("focus-license", fn),
});
