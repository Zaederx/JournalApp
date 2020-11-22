const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs');
const path = require('path');
// const helper = require('./helpers/dateStr');
const eCreate = require('./helpers/e-crud/e-create');
const eRead = require('./helpers/e-crud/e-read');
const eUpdate = require('./helpers/e-crud/e-update');
const eDelete = require('./helpers/e-crud/e-delete');

var filename = 'default';

function createWindow () {
  var integration = false;
  if (process.env.NODE_ENV === 'test-main') {
     integration = true;
  }
  const window = new BrowserWindow({
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
ipcMain.on('e-update', (event, entry, filename) => eUpdate.update(event, entry, filename))

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