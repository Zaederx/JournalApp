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

//produce electron binary file path for the wdio.config.ts
const appBinaryPath = app.getPath('exe')
const appPath = app.getAppPath()
const filename1 = 'electronBinaryPath.txt'
const filename2 = 'electronAppPath.txt'

try {
  fs.promises.writeFile(filename1, appBinaryPath, 'utf-8')
  fs.promises.writeFile(filename2, appPath, 'utf-8')
}
catch (err) {
  console.log(err)
}

//TODO - option to store file in iCloud

let window: BrowserWindow;

var integration = false;
async function createWindow() {

  if (process.env.NODE_ENV === 'test-main') {
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
        v8CacheOptions: 'none',//prevents electron's v8 Chromium browser engine from caching
      }
    })


  window.loadFile('html/create-entry.html');

  
  const exists = await passwordFileExists()
  
  if (exists)
  {
    console.log('password file exists')
    window.loadFile('html/authenticate.html')
  }
  else 
  {
    console.warn('password file does not exist')
    window.loadFile('html/create-entry.html');
    //wait for event from create entry

    //put as 'once' because it sometimes fires 
    //multiple times on one page load without it...
    ipcMain.once('password-reminder-?',(event)=> {
      window.webContents.send('register-password-reminder')
    })
  }

  if (process.env.NODE_ENV === 'dev-tools') {
    window.webContents.openDevTools();
  }

  /**
   * Append entries and tags to the side-panel
   */
  ipcMain.on('ready-to-show', async (event) => appendEntriesAndTags(event))
}


async function retrieveSettingsJson()
{
  
}









//if directory doesn't exist - create directory
var directory = paths.join(dirs.allEntries)
if (!fs.existsSync(directory)) {
  try {
    fs.promises.mkdir(directory)
    console.log('Successfully created directory')
  }
  catch (error) {
    console.log('Error creating directory:', error)
  }
  console.log(app.getPath('home'))
}
//vars for tags
var tagDirectoryNames: string[] = []
var tagsHTML: string = ''
//vars for entries

//Read entry names from 'tagDir/all'
var entryDates: EntryDate[] = []
//Read entry names from 'tagDir/'
var filesHtml: string = ''
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

ipcMain.handle('settings-view', () => {
  window.loadFile('html/settings.html')
})

// entry C.R.U.D.
ipcMain.handle('create-entry', async (event, entry_json) => {
  var message = eCreate.createEntry(entry_json)
  return message
})

ipcMain.handle('read-entry', async (event, entry_filename) => {
  var dir = dirs.allEntries
  var message = eRead.readSingleFile(dir, entry_filename)
  return message
})

// ipcMain.handle('update-entry', async (event, entry_json, entry_filename) => {
//   var message = eUpdate.updateEntry(entry_json, entry_filename)
//   return message
// })

//var for the selected entry
async function getCurrentEntryName()
{
  const json = false// will return an entry when false
  const entry = await getCurrentEntry(json) as Entry
  return entry.cdate+'.json'
}
ipcMain.handle('update-current-entry', async (event, entry_json) => {
  var selectedEntryName = await getCurrentEntryName()
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


// ipcMain.on('list-all-tags-html', async (event) => {
//   event.reply('recieve-list-all-tags-html', tagsHTML)
// })

// ipcMain.on('list-all-entries-html', async (event) => {
//   event.reply('recieve-list-all-tags-html',filesHtml)
// })

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
  const { allEntries, tagDirectory } = dirs
  var childProcess = c_process.spawn('node', ['js/send-entries.js', allEntries, tagDirectory, tagName], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })
  childProcess.on('message', (message:any) => {
    event.reply('recieve-tag-entries', message)
  })
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
      pCrud.storePasswordHash(dirs.secureFolder,passwordHash)
      return 'Password registered successfully'
    } catch (error) {
      console.log(error)
    }
  }
  else 
  {
    return 'Passwords do not match'
  }
})


const loggedIn = {is:false}
ipcMain.handle('login', async (event, password) => {
  //authenticate password
  var authenticated = await pCrud.functionAutheticatePassword(password)
  if (authenticated) 
  {
    loggedIn.is = true
    return 'Password successfully authenticated.'
  }
  else
  {
    return 'Password not authenticated. Please enter a valid password.'
  }
})

ipcMain.handle('logout', () => {
  loggedIn.is = false
})