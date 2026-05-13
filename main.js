const { app, BrowserWindow } = require("electron");
const serve = require("electron-serve");
const path = require("path");

const appServe = app.isPackaged ? serve({ directory: path.join(__dirname, "out") }) : null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: "hidden", // Makes it look native
    titleBarOverlay: {
      color: "#0f172a", // Match Tailwind slate-900
      symbolColor: "#ffffff",
    },
    backgroundColor: "#020617", // Match Tailwind slate-950
  });

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    // In development, Next.js typically runs on port 3000
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    
    // Add reload listener
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
