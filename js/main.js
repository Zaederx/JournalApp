"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const eCreate = require("./helpers/e-crud/e-create");
const eRead = require("./helpers/e-crud/e-read");
const eUpdate = require("./helpers/e-crud/e-update");
const eDelete = require("./helpers/e-crud/e-delete");
let window;
var filename = 'default';
function createWindow() {
    var integration = false;
    if (process.env.NODE_ENV === 'test-main') {
        integration = true;
    }
    window = new electron_1.BrowserWindow({
        width: 921,
        height: 600,
        minWidth: 921,
        minHeight: 478,
        webPreferences: {
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            nodeIntegration: integration,
            preload: path.join(__dirname, "preload.js")
        }
    });
    window.loadFile('html/main.html');
    if (process.env.NODE_ENV === 'dev-tools') {
        window.webContents.openDevTools();
    }
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    //quit completely even on darwin (mac) if it is a test
    if (process.env.NODE_ENV === 'test') {
        electron_1.app.quit();
    }
    else if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
/* IPC FUNCTIONS */
electron_1.ipcMain.on('new_content', function (e, htmlFilename) {
    console.log('ipcmain: New Content -' + htmlFilename);
    window.loadFile(htmlFilename);
});
/**************** C.R.U.D. METHODS ****************** */
// Create Entry
electron_1.ipcMain.on('e-create', (event, entry) => {
    eCreate.createEvent(event, entry);
    window.webContents.send('test-create-entry', 'done');
});
// Read Entry
electron_1.ipcMain.on('e-read', (event, filename) => {
    eRead.readSingleFile(event, filename);
    window.webContents.send('test-read-entry', 'done');
});
// Update Entry
electron_1.ipcMain.on('e-update', (event, entryJson, filename) => {
    eUpdate.updateEntry(event, entryJson, filename);
    window.webContents.send('test-update-entry', 'done');
});
// Delete Entry
electron_1.ipcMain.on('e-delete', (event, filename) => {
    eDelete.deleteEntry(event, filename);
    window.webContents.send('test-delete-entry', 'done');
});
/**************************************** */
// READ DIRECTORIES - lists all tag directories
electron_1.ipcMain.on('d-read', (event) => eRead.readAllDirectories(event));
// READ DIRECTORY FILES - files inside a specific directory
electron_1.ipcMain.on('de-read', (event, dir) => eRead.readDirFiles(event, dir));
electron_1.ipcMain.on('console', function (event, message) {
    console.log('ipcMain: logging message to console:' + message);
});
