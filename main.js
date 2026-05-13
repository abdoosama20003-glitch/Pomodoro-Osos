const { app, BrowserWindow, protocol, net } = require("electron");
const path = require("path");

// Register custom protocol
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, supportFetchAPI: true, bypassCSP: true } }
]);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: "hidden", 
    titleBarOverlay: {
      color: "#0f172a", 
      symbolColor: "#ffffff",
    },
    backgroundColor: "#020617", 
  });

  if (app.isPackaged) {
    win.loadURL("app://-/");
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.whenReady().then(() => {
  protocol.handle('app', (request) => {
    let url = request.url.slice('app://-'.length);
    if (url.startsWith('/')) {
      url = url.slice(1);
    }
    
    let relativePath = url;
    if (!url || url === '') {
      relativePath = 'index.html';
    } else if (!path.extname(url)) {
      relativePath = url + '.html';
    }

    const absolutePath = path.join(__dirname, 'out', relativePath);
    return net.fetch('file://' + absolutePath);
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
