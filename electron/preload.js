const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("api", {
  onFocusLicense: (fn) => ipcRenderer.on("focus-license", fn),
});
