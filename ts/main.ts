import {app, BrowserWindow, ipcMain,ipcRenderer } from 'electron';
import path = require('path');
import * as eCreate from './helpers/e-crud/e-create';
import * as eRead from './helpers/e-crud/e-read';
import * as  eUpdate from './helpers/e-crud/e-update';
import * as  eDelete from './helpers/e-crud/e-delete';
import { windowsStore } from 'process';
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
        contextIsolation: true,//otherwise WorldSafe.. message still appears
        nodeIntegration: integration, //whether you can access node methods - e.g. requires, anywhere in the app's js
        preload: path.join(__dirname, "preload.js")
    }
  })

  window.loadFile('html/main.html');
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

/* IPC FUNCTIONS */
ipcMain.on('new_content', function(e,htmlFilename:string) {
    console.log('ipcmain: New Content -' + htmlFilename);
   window.loadFile(htmlFilename);
});

/**************** C.R.U.D. METHODS ****************** */
// Create Entry
ipcMain.on('e-create', (event:Electron.IpcMainEvent, entry:string) => {
  eCreate.createEvent(event,entry);
  //TODO Try to implement an better ansynchronous testing
  // window.webContents.send('test-create-entry', 'done');
});

// Read Entry
ipcMain.on('e-read', (event:Electron.IpcMainEvent, filename:string) => {
  eRead.readSingleFile(event, filename);
  //TODO Try to implement an better ansynchronous testing
  // window.webContents.send('test-read-entry', 'done');
});


// Update Entry
ipcMain.on('e-update', (event:Electron.IpcMainEvent, entryJson:string, filename:string) => {
  eUpdate.updateEntry(event, entryJson, filename);
  //TODO Try to implement an better ansynchronous testing
  // window.webContents.send('test-update-entry', 'done');
})

// Delete Entry
ipcMain.on('e-delete', (event:Electron.IpcMainEvent, filename:string) => {
  eDelete.deleteEntry(event, filename);
  //TODO Try to implement an better ansynchronous testing
  // window.webContents.send('test-delete-entry', 'done');
})

/**************************************** */

// READ DIRECTORIES - lists all tag directories
ipcMain.on('d-read', (event:Electron.IpcMainEvent) => eRead.readAllDirectories(event))

// READ DIRECTORY FILES - files inside a specific directory
ipcMain.on('de-read', (event:Electron.IpcMainEvent, dir:string) => eRead.readDirFiles(event, dir));



ipcMain.on('console', function (event:Electron.IpcMainEvent, message:string) {
  console.log('ipcMain: logging message to console:'+ message);
})
