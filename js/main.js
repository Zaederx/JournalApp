const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
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

  window.loadFile('html/main.html')
  window.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

/* IPC FUNCTIONS */
// TODO: set up ipcMain
ipcMain.on('new_content', function(e,content) {
    console.log('ipcmain: New Content -' + content)

    window.loadFile(content)
})

// TODO: set up ipcMain
ipcMain.on('create_Entry', function(e,content) {
  console.log('ipcmain: Creating new Entry -' + content)

  
})


// TODO: set up ipcMain
ipcMain.on('read_Entry', function(e,content) {
  console.log('ipcmain: Reading new Entry -' + content)

  
})
// TODO: set up ipcMain
ipcMain.on('update_Entry', function(e,content) {
  console.log('ipcmain: Updating Entry -' + content)

  
})
// TODO: set up ipcMain
ipcMain.on('delete_Entry', function(e,content) {
  console.log('ipcmain: Deleting Entry -' + content)

  
})

ipcMain.on('console', function (e,content) {
  console.log('ipcMain: loging message to console:'+ content)
})