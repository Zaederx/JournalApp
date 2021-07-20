import {app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import path = require('path');
import * as dir from './directory'
import * as eCreate from './entry/crud/backend/e-create'
import * as eRead from './entry/crud/backend/e-read'
import * as eUpdate from './entry/crud/backend/e-update'
import * as eDelete from './entry/crud/backend/e-delete'

import * as tCreate from './tag/crud/backend/t-create'
import * as tRead from './tag/crud/backend/t-read'
import * as tUpdate from './tag/crud/backend/t-update'
import * as tDelete from './tag/crud/backend/t-delete'


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

  window.loadFile('html/create-entry.html');

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


// Display HTML Views
//Entry Create
ipcMain.handle('create-entry-view', () => {
  window.loadFile('html/create-entry.html')
})
//Entry Read
ipcMain.handle('entry-view', () => {
  window.loadFile('html/view-entry.html')
})
//Entry Update & Delete
ipcMain.handle('edit-entry-view', () => {
  window.loadFile('html/edit-entry.html')
})

//  Tag - Create, Read, Update, Delete
ipcMain.handle('edit-tags', () => {
  window.loadFile('html/edit-tags.html')
})


// entry C.R.U.D.
ipcMain.handle('create-entry', async (event,entry_json) => {
  var message = eCreate.createEntry(entry_json)
  return message
})

ipcMain.handle('read-entry', async (event, entry_filename) => {
  var message = eRead.readSingleFile(entry_filename)
  return message
})

ipcMain.handle('update-entry', async (event, entry_json, entry_filename) => {
  var message = eUpdate.updateEntry(entry_json, entry_filename)
  return message
})

ipcMain.handle('delete-entry', async (event, entry_filename) => {
  var message = eDelete.deleteEntry(entry_filename)
  return message
})


ipcMain.handle('list-all-entries-html', async () => {
  //Read entry names from 'tagDir/all'
  var files = await eRead.readDirFiles(dir.allEntries)
  //Read entry names from 'tagDir/'
  var filesHtml = eRead.filesToHtml(files,dir.allEntries)
  return filesHtml
})

ipcMain.handle('list-all-tags-html', async () => {
  //Read all tag directory folder names
  var tagDirectoryNames = await tRead.readAllDirectoryNames();
  //Put tags folder names into 'div' tags
  var tagsHTML = tRead.directoryFoldersToHTML(tagDirectoryNames);
  return tagsHTML
})


ipcMain.handle('get-last-entry', async () => {
  //Read Filenames in -> 'tagDir/all'
  var files = await eRead.readDirFiles(dir.allEntries)
  //Put filenames into 'div' tags
  var filesHtml = eRead.filesToHtml(files,dir.allEntries)
  //return last entry
  var lastEntry = filesHtml[0]
  return lastEntry
})