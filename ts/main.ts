import {app, BrowserWindow, dialog, ipcMain, OpenDialogReturnValue } from 'electron';
import path from 'path'
import fs from 'fs'
import * as dir from './directory'

//Entry
import * as eCreate from './entry/crud/e-create'
import * as eRead from './entry/crud/e-read'
import * as eUpdate from './entry/crud/e-update'
import * as eDelete from './entry/crud/e-delete'
import * as eExport from './entry/export/e-export'
//Tag
import * as tCreate from './tag/crud/t-create'
import * as tRead from './tag/crud/t-read'
import * as tUpdate from './tag/crud/t-update'
import * as tDelete from './tag/crud/t-delete'
//Other
import * as theme from './theme/theme'
import dateStr from './entry/crud/dateStr'


//produce electron binary file path for the wdio.config.ts
const appBinaryPath = app.getPath('exe')
const filename1 = 'electronBinaryPath.txt'
const appPath = app.getAppPath()
const filename2 = 'electronAppPath.txt'

console.log('appBinaryPath:'+appBinaryPath)
console.log('writing path to txt file...')
try
{
  fs.promises.writeFile(filename1,appBinaryPath,'utf-8')
  fs.promises.writeFile(filename2,appPath,'utf-8')
}
catch(err)
{
  console.log(err)
}



//TODO - option to store file in iCloud

let window:BrowserWindow;

var integration = false;
function createWindow () 
{
  
  if (process.env.NODE_ENV === 'test-main') 
  {
     integration = true;
  }

  window = new BrowserWindow
  ({
    width: 921,
    height: 600,
    minWidth: 921,
    minHeight: 478,
    webPreferences: 
    {
        // worldSafeExecuteJavaScript: true ,
        contextIsolation: false,//otherwise "WorldSafe".. message still appears
        nodeIntegration: true,//whether you can access node methods - e.g. requires/ import, anywhere in the app's js - needed for front end scripts to work
        enableRemoteModule: true,//enable ipcRenderer in fround end js to speak directly to ipcMain - no need for preload script
        v8CacheOptions:'none',//prevents electron's v8 Chromium browser engine from caching
        
    }
  })

  window.loadFile('html/create-entry.html');

  if (process.env.NODE_ENV === 'dev-tools') 
  {
    window.webContents.openDevTools();
  }
}
//if directory doesn't exist - create directory
var directory = path.join(dir.allEntries)
if (!fs.existsSync(directory)) 
{
  try {
    fs.promises.mkdir(directory)
    console.log('Successfully created directory')
  }
  catch (error) {
    console.log('Error creating directory:',error)
  }
  console.log(app.getPath('home'))
}

app.whenReady().then(createWindow)
//.then(() => theme.setCurrentCssTheme('../css/main.css'));

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

ipcMain.handle('export-entries', () => {
  window.loadFile('html/export.html')
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

//var for the selected entry
var this_selectedEntryName = ''
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
  var entryDates = await eRead.readDirFilesEntryDate(dir.allEntries)
  //Read entry names from 'tagDir/'
  var filesHtml = eRead.entryDateToHtml(entryDates)
  return filesHtml
  // event.reply('recieve-list-all-entries-html',filesHtml)
})


ipcMain.handle('get-last-entry', async () => {
  //Read Filenames in -> 'tagDir/all'
  var entryDates = await eRead.readDirFilesEntryDate(dir.allEntries)
  //Put filenames into 'div' tags
  var filesHtml = eRead.entryDateToHtml(entryDates)
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

ipcMain.handle('get-tag-entries-html', async (event,tagName) => {
  var tagsHTML = await tRead.readTagEntries(tagName)
  return tagsHTML
})


//Tag CRUD
ipcMain.handle('create-tags', async (event, tags) => {
  var tagsHTML = await tCreate.createTags(tags)
  return tagsHTML
})

ipcMain.handle('create-tag', async (event, tags) => {
  var tagsHTML = await tCreate.createTag(tags)
  return tagsHTML
})

ipcMain.handle('delete-tags', async (event, tags:string[]) => {
  var tagsHTML = await tDelete.deleteTags(tags)
  return tagsHTML
})

//i.e. delete entry symlink from tag folder
ipcMain.handle('remove-entry-tags', async (event,tagnames:string[]) => {
  var message = await tDelete.removeEntrySymlinks(tagnames,this_selectedEntryName)
  return message
})




ipcMain.handle('get-current-css-theme', (e) => theme.getCurrentCssTheme())

//@ts-ignore
ipcMain.handle('set-current-css-theme', (e,themeStr:string) => theme.setCurrentCssTheme(themeStr))

//get the current date as a string (used for the entry filename)
ipcMain.handle('get-datestr', () => dateStr())

ipcMain.handle('get-tag-directory-filepath', (e) => {
  return dir.tagDirectory
})

//export entries to txt, json or pdf
ipcMain.handle('export-entries-txt', async () => {
  var dialogPath = dir.tagDirectory
  dialogPath ? console.log(`dialogPath:${dialogPath}`) : console.log('dialogPath is null or undefined')
  //open dialog window
  var promise:OpenDialogReturnValue = await dialog.showOpenDialog({ defaultPath: dialogPath, properties: ['openFile', 'multiSelections'] })

   //if not exited
   if (promise && !promise.canceled)
   {
       //get filepaths of entries
       var entriesFilepathsArr:string[] = promise.filePaths
       //export entries
       return await eExport.exportToTxt(entriesFilepathsArr)
   }
   
})


ipcMain.handle('export-entries-json', async () => {
  var dialogPath = dir.tagDirectory
  dialogPath ? console.log(`dialogPath:${dialogPath}`) : console.log('dialogPath is null or undefined')
  //open dialog window
  var promise:OpenDialogReturnValue = await dialog.showOpenDialog({ defaultPath: dialogPath, properties: ['openFile', 'multiSelections'] })

  //if not exited
  if (promise && !promise.canceled)
  {
      //get filepaths of entries
      var entriesFilepathsArr:string[] = promise.filePaths
      //export entries
      return await eExport.exportToJson(entriesFilepathsArr)
  }

})

ipcMain.handle('export-entries-pdf', async () => {
  var dialogPath = dir.tagDirectory
  dialogPath ? console.log(`dialogPath:${dialogPath}`) : console.log('dialogPath is null or undefined')
  //open dialog window
  var promise:OpenDialogReturnValue = await dialog.showOpenDialog({ defaultPath: dialogPath, properties: ['openFile', 'multiSelections'] })

  //if not exited
  if (promise && !promise.canceled)
  {
      //get filepaths of entries
      var entriesFilepathsArr:string[] = promise.filePaths
      //export entries
      return await eExport.exportToPdf(entriesFilepathsArr)
  }
})
// ipcMain.handle('show-open-dialog')