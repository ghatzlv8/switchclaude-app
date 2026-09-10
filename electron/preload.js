const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("api", {
  activate: (key) => ipcRenderer.invoke("license:activate", key),
  getState: () => ipcRenderer.invoke("accounts:list"),
  addAccount: () => ipcRenderer.invoke("accounts:add"),
  switchTo: (id) => ipcRenderer.invoke("accounts:switch", id),
  onState: (fn) => ipcRenderer.on("state", (_, s) => fn(s)),
  onFocusLicense: (fn) => ipcRenderer.on("focus-license", fn),
});
