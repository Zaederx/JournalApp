import {app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import path from 'path'
import fs from 'fs'
import * as dir from './directory'
import * as eCreate from './entry/crud/e-create'
import * as eRead from './entry/crud/e-read'
import * as eUpdate from './entry/crud/e-update'
import * as eDelete from './entry/crud/e-delete'

import * as tCreate from './tag/crud/t-create'
import * as tRead from './tag/crud/t-read'
import * as tUpdate from './tag/crud/t-update'
import * as tDelete from './tag/crud/t-delete'
import { mergeSort } from './algorithms/mergesort';

var this_selectedEntryName = ''

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
        // worldSafeExecuteJavaScript: true ,
        contextIsolation: false,//otherwise "WorldSafe".. message still appears
        nodeIntegration: true, //whether you can access node methods - e.g. requires, anywhere in the app's js
    }
  })

  window.loadFile('html/create-entry.html');

  if (process.env.NODE_ENV === 'dev-tools') {
    window.webContents.openDevTools();
  }
}
//if directory doesn't exist - create directory
var directory = path.join(dir.allEntries)
if (!fs.existsSync(directory)) {
  try {
    fs.promises.mkdir(directory)
    console.log('Successfully created directory')
  }
  catch (error) {
    console.log('Error creating directory:',error)
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

ipcMain.handle('settings-view',() => {
  window.loadFile('html/settings.html')
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

ipcMain.handle('update-current-entry', async (event, entry_json) => {
  var message = eUpdate.updateEntry(entry_json, this_selectedEntryName)
  return message
})

ipcMain.handle('delete-entry', async (event, entry_filename) => {
  var message = eDelete.deleteEntry(entry_filename)
  return message
})

ipcMain.handle('delete-current-entry', async (event) => {
  var message = eDelete.deleteEntry(this_selectedEntryName)
  this_selectedEntryName = ''
  return message
})


ipcMain.on('list-all-tags-html', async (event) => {
  //Read all tag directory folder names
  var tagDirectoryNames = await tRead.readAllTags();
  console.log('tagDirectoryNames:',tagDirectoryNames)
  //Put tags folder names into 'div' tags
  var tagsHTML = tRead.directoryFoldersToHTML(tagDirectoryNames);
  console.log('tagsHTML',tagsHTML)
  event.reply('recieve-list-all-tags-html', tagsHTML)
})


ipcMain.on('list-all-tags-html-tr', async (event) => {
  //Read all tag directory folder names
  var tagDirectoryNames = await tRead.readAllTags();
  console.log('tagDirectoryNames:',tagDirectoryNames)
  //Put tags folder names into 'div' tags
  var tagsHTML = tRead.directoryFoldersToHTML(tagDirectoryNames);
  console.log('tagsHTML',tagsHTML)
  event.reply('recieve-list-all-tags-html', tagsHTML)
})

ipcMain.handle('list-all-entries-html', async (event) => {
  //Read entry names from 'tagDir/all'
  var files = await eRead.readDirFiles(dir.allEntries)
  //Read entry names from 'tagDir/'
  var filesHtml = eRead.filesToHtml(files,dir.allEntries)
  return filesHtml
  // event.reply('recieve-list-all-entries-html',filesHtml)
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



ipcMain.handle('set-current-entry', (event, selectedEntryName) => {
 this_selectedEntryName = selectedEntryName
})

ipcMain.handle('get-current-entry-name', (event) => {
  return this_selectedEntryName
 })

ipcMain.handle('get-current-entry', async (event) => {
  var entry = await eRead.readSingleFile(this_selectedEntryName)
  console.log('current-entry:',entry)
  return entry
})

ipcMain.handle('get-tags-table-rows', async (event) => {
  var tagsHTML = await tRead.getTags_EntryCount_CreationDate()
  return tagsHTML
})
var arr:number[] = [5,4,3,2,1]

console.log('mergeSort',mergeSort(arr))