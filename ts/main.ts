import {app, BrowserWindow, ipcMain,ipcRenderer } from 'electron';
import path = require('path');
import * as dirs from './helpers/directory';

// Entry C.R.U.D
import * as eCreate from './helpers/e-crud/e-create';
import * as eRead from './helpers/e-crud/e-read';
import * as  eUpdate from './helpers/e-crud/e-update';
import * as  eDelete from './helpers/e-crud/e-delete';

// Tag C.R.U.D
import * as tCreate from './helpers/t-crud/t-create';
import * as tRead from './helpers/t-crud/t-read';
import * as tUpdate from './helpers/t-crud/t-update';
import * as tDelete from './helpers/t-crud/t-delete';

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

//SECTION C.R.U.D. METHODS ****************** */
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

//SECTION READ DIRECTORIES - lists all tag directories
ipcMain.on('d-read', (event:Electron.IpcMainEvent) => eRead.readAllDirectories(event))

// READ DIRECTORY FILES - files inside a specific directory
ipcMain.on('de-read', (event:Electron.IpcMainEvent, dir:string) => eRead.readDirFiles( dirs.tagDirectory+(dir ? dir+'/':''), event, 'response-de-read'));



ipcMain.on('console', function (event:Electron.IpcMainEvent, message:string) {
  console.log('ipcMain: logging message to console:'+ message);
})


//SECTION ** Tag C.R.U.D Handlers */

ipcMain.on('t-create', (event:Electron.IpcMainEvent,tagnames:string[]) => tCreate.createTags(event,tagnames));

ipcMain.handle('t-create-promise', async(event:Electron.IpcMainInvokeEvent, tagNames:string[]) => {
  var success = tCreate.createTagsInvoke(tagNames); 
  return success
});
ipcMain.handle('t-read-all', async (event:Electron.IpcMainInvokeEvent) => {
  //read all
  var allTags:string[] = tRead.readTagDir();
  //return result
  return allTags;
})

ipcMain.on('t-read', (event:Electron.IpcMainEvent, tagName:string) => tRead.readTagEntries(event,tagName));

ipcMain.handle('t-update', async (event:Electron.IpcMainInvokeEvent, dirName, newDirName) => {
  var message = await tUpdate.updateTag(dirName,newDirName)
  return message
})

ipcMain.handle('t-delete', async (event:Electron.IpcMainInvokeEvent,tagname:string) => {
  var message:string = tDelete.deleteTag(tagname);
  
  return message;
});


