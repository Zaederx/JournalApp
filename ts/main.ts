import { app, BrowserWindow, dialog, ipcMain, OpenDialogReturnValue, IpcMainEvent } from 'electron';
import paths from 'path'
import fs from 'fs'
import * as dirs from './directory'

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
//Password
import * as pCrud from './security/password-crud'
//Other
import * as theme from './theme/theme'
import dateStr from './entry/crud/dateStr'
import EntryDate from './classes/entry-date';
import { appendEntriesAndTags } from './view/display/append-entries-tags'
import c_process from 'child_process'
import { passwordFileExists } from './security/password-crud';
import Entry from './classes/entry';
import { setCurrentEntry, getCurrentEntry } from './view/create-entry/current-entry'
import pathsForWDIO from './other/paths-for-wdio'
import { retrieveSettingsJson as retrieveSettings, saveSettingsJson } from './settings/settings-functions'
import { settings } from './settings/settings-type';
import { printFormatted } from './other/stringFormatting'
import { createAllTagDirectory } from './fs-helpers/helpers';
import createWindow from './other/create-window'
//IMPORTANT - Add birthtime (number) to entry files - so that when an entry is is transfered across systems it still load in correct order (as system btime is dependent on file creation date within that specific system)
//TODO - option to store file in iCloud
//TODO - SEND AND EMAIL IN NODE.JS - temporary password for login recovery

let window: BrowserWindow;

var integration = false;

app.whenReady().then(async () => { 
  createAllTagDirectory()
  window = await createWindow(window,integration)
})

/**
 * important in determining whether to present
 * password dialog
 */
var windowJustOpened = false
app.on('browser-window-focus',() => {
  printFormatted('blue','app.on("browser-window-focus") has been triggered')
  loggedIn.is = false //setting loggedin to false allows auth-dailog to appear
  windowJustOpened = true
  window.reload()//reloading the page will trigger 'password-reminder-?' in login.ts - making auth-dialog appear
})




/**
   * 
   * Append entries and tags to the side-panel
   */
ipcMain.on('ready-to-show-sidepanel', async (event) => appendEntriesAndTags(event))

  
  //waits for event from create-entry.ts
ipcMain.on('password-reminder-?', async (event)=> {
  printFormatted('blue','password-reminder-? triggered')
  const passwordExists = await passwordFileExists()
  const jsonStr = false
  const settings:settings = await retrieveSettings(jsonStr)

  console.log('passwordExists:'+passwordExists) 
  console.log('settings:')
  console.log(settings)
  console.log('loggedIn.is:'+loggedIn.is)
  console.log('windowJustOpened:'+windowJustOpened) 

  //open authentication dialog
  if (passwordExists && settings['password-protection'] == 'true' && loggedIn.is == false && windowJustOpened)
  {
    windowJustOpened = false
    printFormatted('green','password file exists')
    printFormatted('green','password protection is set to true')
    printFormatted('green','opening authentication dialog...')
    window.webContents.send('open-authentication-dialog')
  }
  //send reminder
  else if(settings['password-protection'] == 'false' && settings['password-reminder'] == 'true' && windowJustOpened)
  {
    if (!passwordFileExists) { printFormatted('yellow','password file does not exist') }

    printFormatted('white','sending reminder message')
    //enable login - they are effectively logged in if there is no password set up
    loggedIn.is = true
    printFormatted('green','loggedIn.is:'+loggedIn.is)
    window.webContents.send('register-password-reminder')
    console.log('enabling navigation...')
    window.webContents.send('enable-navigation')//send message to nav.ts to enable
  }
})

ipcMain.on('enable-navigation-?', (event) => {
  console.log('enable navigation attempt:')
  if(loggedIn.is == true) {
    printFormatted('green','enabling navigation...')
    event.reply('enable-navigation')
  }
  else
  {
    printFormatted('red','declining to enable navigation...')
  }
})

var loggedIn = {is:false}
ipcMain.handle('login', async (event, password) => {
  //authenticate password
  var authenticated = await pCrud.functionAutheticatePassword(password)
  if (authenticated) 
  {
    loggedIn.is = true
    return 'success'
  }
  else
  {
    return 'Password not authenticated. Please enter a valid password.'
  }
})

ipcMain.handle('logout', () => {
  loggedIn.is = false
})

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
    createWindow(window,integration);
  }
});


//SECTION Display HTML Views
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

ipcMain.handle('settings-view', () => {
  window.loadFile('html/settings.html')
})

//SECTION Entry C.R.U.D.
ipcMain.handle('create-entry', async (event, entry_json) => {
  var message = eCreate.createEntry(entry_json)
  return message
})

ipcMain.handle('read-entry', async (event, entry_filename) => {
  var dir = dirs.allEntries
  var message = eRead.readSingleFile(dir, entry_filename)
  return message
})

//var for the selected entry
async function getCurrentEntryName()
{
  const json = false// will return an entry when false
  const entry = await getCurrentEntry(json) as Entry
  return entry.cdate+'.json'
}

ipcMain.handle('update-current-entry', async (event, entry_json) => {
  var selectedEntryName = await getCurrentEntryName()
  printFormatted('green', 'selectedEntryName:',selectedEntryName)
  printFormatted('green', 'entry_json:', entry_json )
  var message = eUpdate.updateEntry(entry_json, selectedEntryName)
  return message
})

ipcMain.handle('delete-entry', async (event, entry_filename) => {
  var message = eDelete.deleteEntry(entry_filename)
  return message
})

ipcMain.handle('delete-current-entry', async (event) => {
  var message = eDelete.deleteEntry(await getCurrentEntryName())
  //delete/remove from current entry tag folder
  setCurrentEntry('')
  return message
})

ipcMain.handle('get-last-entry', async () => {
  //Read Filenames in -> 'tagDir/all'
  var entryDates = await eRead.readDirFilesEntryDate(dirs.allEntries)
  //Put filenames into 'div' tags
  var filesHtml = eRead.entryDateToHtml(entryDates)
  //return last entry
  var lastEntry = filesHtml[0]
  return lastEntry
})


ipcMain.handle('set-current-entry', (event, selectedEntryName) => setCurrentEntry(selectedEntryName))


ipcMain.handle('get-current-entry-name', async (event) => {
  const json = false// will return an entry when false
  const entry = await getCurrentEntry(json) as Entry
  entry.cdate+'.json'
})

ipcMain.handle('get-current-entry', async (event) => {
  const json = true
  var entryJsonStr = await getCurrentEntry(json) as string
  console.log('current-entry:', entryJsonStr)
  return entryJsonStr
})

ipcMain.handle('get-tags-table-rows', async (event) => {
  var tagsHTML = await tRead.getTagsEntryCountCreationDate(dirs.tagDirectory)
  return tagsHTML
})

ipcMain.on('get-tag-entries', async (event, tagName) => {
  //get directories
  const { allEntries, tagDirectory } = dirs
  //start a child process
  var childProcess = c_process.spawn('node', ['js/send-entries.js', allEntries, tagDirectory, tagName], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })

  //recieve messages from child process on this the main process & send/forward to renderer process
  childProcess.on('message', (message:any) => {
    if (message.entryFilename) {
      event.reply('recieve-tag-entries', message)
    }
    else if (message == 'start-loader') {
      event.reply('activate-loader')
    }
    else if (message == 'stop-loader') {
      event.reply('deactivate-loader')
    }
  })
})

//SECTION Tag CRUD
ipcMain.handle('create-tags', async (event, tags) => {
  var tagsHTML = await tCreate.createTags(tags)
  return tagsHTML
})

ipcMain.handle('create-tag', async (event, tags) => {
  var tagsHTML = await tCreate.createTag(tags)
  return tagsHTML
})

ipcMain.handle('delete-tags', async (event, tags: string[]) => {
  var tagsHTML = await tDelete.deleteTags(tags)
  return tagsHTML
})

//i.e. delete entry symlink from tag folder
ipcMain.handle('remove-entry-tags', async (event, tagnames: string[]) => {
  const json = false
  var e = await getCurrentEntry(json) as Entry
  const selectedEntryName = e.cdate+'.json'
  var message = await tDelete.removeEntrySymlinks(tagnames, selectedEntryName)
  return message
})

ipcMain.handle('get-current-css-theme', (e) => theme.getCurrentCssTheme())

//@ts-ignore
ipcMain.handle('set-current-css-theme', (e, themeStr: string) => theme.setCurrentCssTheme(themeStr))

//get the current date as a string (used for the entry filename)
ipcMain.handle('get-datestr', () => dateStr())

ipcMain.handle('get-tag-directory-filepath', (e) => {
  return dirs.tagDirectory
})

//SECTION - Export
//export entries to txt, json or pdf
ipcMain.handle('export-entries-txt', async () => {
  var dialogPath = dirs.tagDirectory
  dialogPath ? console.log(`dialogPath:${dialogPath}`) : console.log('dialogPath is null or undefined')
  //open dialog window
  var promise: OpenDialogReturnValue = await dialog.showOpenDialog({ defaultPath: dialogPath, properties: ['openFile', 'multiSelections'] })

  //if not exited
  if (promise && !promise.canceled) {
    //get filepaths of entries
    var entriesFilepathsArr: string[] = promise.filePaths
    //export entries
    return await eExport.exportToTxt(entriesFilepathsArr)
  }

})


ipcMain.handle('export-entries-json', async () => {
  var dialogPath = dirs.tagDirectory
  dialogPath ? console.log(`dialogPath:${dialogPath}`) : console.log('dialogPath is null or undefined')
  //open dialog window
  var promise: OpenDialogReturnValue = await dialog.showOpenDialog({ defaultPath: dialogPath, properties: ['openFile', 'multiSelections'] })

  //if not exited
  if (promise && !promise.canceled) {
    //get filepaths of entries
    var entriesFilepathsArr: string[] = promise.filePaths
    //export entries
    return await eExport.exportToJson(entriesFilepathsArr)
  }

})

ipcMain.handle('export-entries-pdf', async () => {
  var dialogPath = dirs.tagDirectory
  dialogPath ? console.log(`dialogPath:${dialogPath}`) : console.log('dialogPath is null or undefined')
  //open dialog window
  var promise: OpenDialogReturnValue = await dialog.showOpenDialog({ defaultPath: dialogPath, properties: ['openFile', 'multiSelections'] })

  //if not exited
  if (promise && !promise.canceled) {
    //get filepaths of entries
    var entriesFilepathsArr: string[] = promise.filePaths
    //export entries
    return await eExport.exportToPdf(entriesFilepathsArr)
  }
})
// ipcMain.handle('show-open-dialog')

ipcMain.handle('register-password', (event, password1, password2) => {
  if(password1 == password2) {
    try {
      //hash password
      var passwordHash = pCrud.hashPassword(password1)
      //store password hash
      const message = pCrud.storePasswordHash(dirs.secureFolder,passwordHash)
      return message
    } catch (error) {
      console.log(error)
    }
  }
  else 
  {
    return 'Passwords do not match'
  }
})

//SECTION - SETTINGS 
ipcMain.handle('get-settings-json', async (event)=> {
  const jsonStr = true
  var settingsJson = await retrieveSettings(jsonStr) as string
  console.log('retrieving setting:'+ settingsJson)
  return settingsJson
})

ipcMain.handle('set-settings-json', async (event, settingsJsonStr) => {
  const settings = JSON.parse(settingsJsonStr)
  console.log('saving setting:')
  console.log(settings)//on separate console log line so that it prints the object contents
  var message = await saveSettingsJson(settings)
  return message
})
