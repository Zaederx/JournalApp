const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs');
const path = require('path');
const helper = require('./helpers/dateStr');
const eCreate = require('./helpers/e-crud/e-create');
const eRead = require('./helpers/e-crud/e-read');
const eUpdate = require('./helpers/e-crud/e-update');
const eDelete = require('./helpers/e-crud/e-delete');
var filename = 'default';

function createWindow () {
  const window = new BrowserWindow({
    width: 896,
    height: 600,
    minWidth: 896,
    minHeight: 478,
    webPreferences: {
        worldSafeExecuteJavaScript: true ,
        contextIsolation: true,//otherwise WorldSafe.. message still appears
        preload: path.join(__dirname, "preload.js")
    }
  })

  window.loadFile('html/main.html');
  window.webContents.openDevTools()
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/* IPC FUNCTIONS */
// TODO: set up ipcMain
ipcMain.on('new_content', function(e,content) {
    console.log('ipcmain: New Content -' + content);
    window.loadFile(content);
});

/**************** C.R.U.D. METHODS ****************** */
// Create Entry
ipcMain.on('e-create', (event,entry) => eCreate.create(event,entry));

// Read Entry
ipcMain.on('e-read', (event,filename) => eRead.readSingleFile(event, filename));


// Update Entry
ipcMain.on('e-update', function(e,content) {
  console.log('ipcMain: Updating Entry -' + content);  
})

// Delete Entry
ipcMain.on('e-delete', (event, filename) => eDelete.delete(event, filename))

/**************************************** */

// READ DIRECTORIES - lists all tag directories
ipcMain.on('d-read', (event) => eRead.readAllDirectories(event))

// READ DIRECTORY FILES - files inside a specific directory
ipcMain.on('de-read', (event, dir) => eRead.readDirFiles(event, dir));



ipcMain.on('console', function (e,content) {
  console.log('ipcMain: logging message to console:'+ content);
})