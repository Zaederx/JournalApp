const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs');
const path = require('path');
const helper = require('./helpers/dateStr');
const eCreate = require('./helpers/e-crud/e-create');
const eRead = require('./helpers/e-crud/e-read');
const eUpdate = require('./helpers/e-crud/e-update');
const eDelete = require('./helpers/e-crud/e-delete');

function createWindow () {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
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

    window.loadFile(content)
});

// TODO: set up ipcMain
ipcMain.on('create_Entry', (event,dir) => eCreate.Create(event,dir));

// READ DIRECTORIES - lists all tag directories
ipcMain.on('read_Directories', (event) => eRead.readAllDirectories(event))

// READ DIRECTORY FILES - files inside a specific directory
ipcMain.on('readDirectoryFiles', (event, dir) => eRead.readDirFiles(event, dir));


// Read single file
ipcMain.on('readFile', (event,filename) => eRead.readSingleFile(event, filename))


// TODO: set up ipcMain
ipcMain.on('read_Entry', function(e,content) {
  console.log('ipcMain: Reading new Entry -' + content);

  console.log('ipcMain: Problem presenting entries.');
})
// TODO: set up ipcMain
ipcMain.on('update_Entry', function(e,content) {
  console.log('ipcMain: Updating Entry -' + content);

  
})
// TODO: set up ipcMain
ipcMain.on('delete_Entry', function(e,content) {
  console.log('ipcMain: Deleting Entry -' + content);

  
})

ipcMain.on('console', function (e,content) {
  console.log('ipcMain: loging message to console:'+ content);
})