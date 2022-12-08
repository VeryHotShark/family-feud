const { app, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');

let hostWindow, playerWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  let state = windowStateKeeper({
    defaultWidth : 800,
    defaultHeight : 600
  })

  hostWindow = new BrowserWindow({
    x: state.x - 300,
    y: state.y,
    width: state.width,
    height: state.height,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  playerWindow = new BrowserWindow({
    x: state.x + 300,
    y: state.y,
    width: state.width,
    height: state.height,
    parent: hostWindow,
    frame: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  })

  hostWindow.loadFile(path.join(__dirname, 'main.html'));
  playerWindow.loadFile(path.join(__dirname, 'main.html'));

  state.manage(hostWindow);

  hostWindow.webContents.openDevTools();

  hostWindow.on('closed',  () => {
    hostWindow = null
  })

  playerWindow.on('close', () => {
    playerWindow = null
  })
};

app.on('ready', createWindow);

app.on('before-quit', e => {
  e.preventDefault();
})

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
