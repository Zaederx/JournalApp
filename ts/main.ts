import {app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import path = require('path');

// Entry C.R.U.D


// Tag C.R.U.D


let window:BrowserWindow;

var filename = 'default';

function createWindow () {
  var integration = false;
  if (process.env.NODE_ENV === 'test-main') {
     integration = true;
}

  window = new BrowserWindow({
    width: 921,
    height: 600,
    minWidth: 921,
    minHeight: 478,
    webPreferences: {
        worldSafeExecuteJavaScript: true ,
        contextIsolation: true,//otherwise "WorldSafe".. message still appears
        nodeIntegration: integration, //whether you can access node methods - e.g. requires, anywhere in the app's js
        preload: path.join(__dirname, "preload.js")
    }
  })

  window.loadFile('html/view-entry.html');
  if (process.env.NODE_ENV === 'dev-tools') {
    window.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  //quit completely even on darwin (mac) if it is a test
  if (process.env.NODE_ENV === 'test') {
    app.quit()
  }
  else if (process.platform !== 'darwin') {
    app.quit()
  }
});


app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});