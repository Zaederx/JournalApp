import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent, OpenDialogReturnValue } from 'electron';
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
//Password & Security
import * as authCrud from './security/auth-crud'
import { v4 as uuidv4 } from 'uuid'
//emailing
import nodemailer from 'nodemailer'
//Other
import * as theme from './theme/theme'
import dateStr from './entry/crud/dateStr'
import { appendEntriesAndTags } from './view/display/append-entries-tags'
import c_process from 'child_process'
import { passwordFileExists } from './security/auth-crud';
import Entry from './classes/entry';
import { setCurrentEntry, getCurrentEntry } from './view/create-entry/current-entry'
import { retrieveSettingsJson as retrieveSettings, saveSettingsJson } from './settings/settings-functions'
import { settings } from './settings/settings-type';
import { printFormatted } from './other/stringFormatting'
import { createAllTagDirectory } from './fs-helpers/helpers';
import createWindow from './other/create-window'
import { sendResetPasswordEmail, sendVerificationEmail } from './security/send-email'
import { IpcMainInvokeEvent } from 'electron/main';

//IMPORTANT - Add birthtime (number) to entry files - so that when an entry is is transfered across systems it still load in correct order (as system btime is dependent on file creation date within that specific system)
//TODO - option to store file in iCloud
//TODO - SEND AND EMAIL IN NODE.JS - temporary password for login recovery

//NOTE - `ipcMain.handle` works with `ipcRenderer.invoke`
// `on` (from ipcMain, ipcRenderer and window.webContents) works with `send` (from ipcMain `event.reply`, ipcRenderer and window.webContents)

let window: BrowserWindow;

var integration = false;

app.whenReady().then(async () => { 
  createAllTagDirectory()
  window = await createWindow(window,integration)
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

/**
 * This is need for window to be reopened once closed. (as mac app hang on the dock when closed, waiting to be reopened - from my understanding)
 * "Emitted when the application is activated. Various actions can trigger this event, such as launching the application for the first time, attempting to re-launch the application when it's already running, or clicking on the application's dock or taskbar icon." - electronjs.org
 */
app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    window = await createWindow(window,integration);
  }
});

/**
 * important in determining whether to present
 * password dialog
 */
var windowJustOpened = false
app.on('browser-window-focus',() => {
  printFormatted('blue','app.on("browser-window-focus") has been triggered')
  loggedIn.is = false //setting loggedin to false allows auth-dailog to appear


 
  //if on mac - because x doesn't quit app - reload window to trigger password reminder again (which comes on page script load)
  // window.reload()//reloading the page will trigger 'password-reminder-?' in login.ts - making auth-dialog appear

  

  //TODO //IMPORTANT -  (node:2139) UnhandledPromiseRejectionWarning: TypeError: Object has been destroyed
   /* at IpcMainImpl.<anonymous> (/Users/zacharyishmael/Documents/GitHub/Electron/CV/JournalApp/js/main.js:96:16)
    (node:2139) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 4)
    enable navigation attempt:
    declining to enable navigation...
    */
})

// app.on('window-close-', () => {

// })


/**
   * 
   * Append entries and tags to the side-panel
   */
ipcMain.on('ready-to-show-sidepanel', async (event) => appendEntriesAndTags(event))

  
var loggedIn = {is:false}
ipcMain.handle('login', async (event, password) => {
  //authenticate password
  var authenticated = await authCrud.autheticatePassword(password)
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

  //waits for event from create-entry.ts
ipcMain.on('password-reminder-?', async (event, inDialog:'true'|'false')=> {
  printFormatted('blue','password-reminder-? triggered')
  const passwordExists = await passwordFileExists()
  const jsonStr = false
  const settings:settings = await retrieveSettings(jsonStr)

  printFormatted('green','settings:',settings)
  //print passwordExists
  if (passwordExists) printFormatted('green','passwordExists:',passwordExists) 
  else printFormatted('red','passwordExists:',passwordExists)
  //print loggedIn.is
  if (loggedIn.is)printFormatted('green','loggedIn.is:',loggedIn.is)
  else printFormatted('red','loggedIn.is:',loggedIn.is)
  //print windowJustOpened
  if (windowJustOpened) printFormatted('green','windowJustOpened:',windowJustOpened)
  else printFormatted('red','windowJustOpened:',windowJustOpened)

  //open authentication dialog
  if (passwordExists && settings['password-protection'] == 'true' && loggedIn.is == false)
  {
    printFormatted('green','password file exists')
    printFormatted('green','password protection is set to true')
    printFormatted('green','opening authentication dialog...')
    windowJustOpened = false
    event.reply('open-authentication-dialog')
  }
  //send reminder and enable navigation
  else if(settings['password-protection'] == 'false' && settings['password-reminder'] == 'true')
  {
    loggedIn.is = true//enable login - they are effectively logged in if there is no password set up
    
    if (!passwordExists) 
    {
      printFormatted('yellow','password file does not exist') 
    }
    printFormatted('green','loggedIn.is:'+loggedIn.is)
    printFormatted('green','Showing password reminder and enabling navigation.')
    
    //show reminder
    event.reply('register-password-reminder')
    event.reply('enable-navigation')//send message to nav.ts to enable
  }
  //enable navigation without sending a reminder
  else if (settings['password-protection'] == 'false' && settings['password-reminder'] == 'false') {
    printFormatted('green','Enabling navigation...')
    windowJustOpened = false
    event.reply('enable-navigation')//send message to nav.ts to enable
  }
  //if password does not exist and password protection is true - tampering has most likely occured - alert user and prompt to reset password via email
  else if (!passwordExists && settings['password-protection'] == 'true')
  {
    //alert user to problem and that they will receive an email with a reset code
    const message = 'Password file is missing.\n This could be the sign of something malicious.\n Please reset your password by entering you email address you gave upon registration.\n An email will be sent. Be sure to check your bin or spam folder just in case you do not find the mail in your inbox.'

    

    printFormatted('yellow', 'Alerting user of missing password file and reset mesaures.')
    event.reply('open-reset-password-confirm-prompt',message)
  }
})


//SECTION - Reset Password - 3 parts
//1) check the email matches and send reset code
ipcMain.on('send-reset-password-email', async (event, email) => {
  printFormatted('blue', 'ipcMain.on(send-reset-password-email)')
  const message = 'Email does not match stored email.\nPlease enter the email used for this application.'
  //if email matches stored email hash
  const emailAuthenticated = await authCrud.autheticateEmail(email)
  //send email with reset code to user email
  if (emailAuthenticated)
  {
    //uuidv4 code & hash the code
    var code = uuidv4()
    var codeHash = authCrud.hash(code)
    //store reset codeHash
    const message = await authCrud.storeResetCodeHash(codeHash)
    if (message == undefined) 
    {
      printFormatted('red', 'Code was not stored successfully')
    }
    else if (message == true)
    {
      printFormatted('green', 'Code stored successfully.')
      printFormatted('green', 'Sending reset password email to user...')
      //send email with reset code (unhashed)
      sendResetPasswordEmail(email,code)
      //open reset code dialog - for them to input the code they recieved in email
      event.reply('open-reset-code-dialog')
    }
  }
  else//send them back to step 1) the form to input their email to be checked
  {
    printFormatted('green', 'Email did not match stored email.')
    event.reply('reset-password-confirm-prompt', message)
  }
})

//2 do codes match
ipcMain.on('does-reset-code-match-?', resetCodeMatches)

async function resetCodeMatches(event:IpcMainEvent,resetCode:string)
{
  var codesMatch = await authCrud.autheticateResetCode(resetCode)
  if(codesMatch)
  {//progress to step 3 - open the email password dailog box
    event.reply('open-email-password-dialog')
  }
  else
  {//go back to step 2 - open the reset code dialog
    event.reply('open-reset-code-dialog')
  }
}



ipcMain.on('enable-navigation-?', (event) => {
  printFormatted('blue', 'ipcMain.on("enable-navigation-?" fired')
  printFormatted('white','enable navigation attempt:')
  if(loggedIn.is == true) {
    printFormatted('green','enabling navigation...')
    event.reply('enable-navigation')
  }
  else
  {
    printFormatted('red','declining to enable navigation...')
  }
})





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
  var message = await tDelete.deleteTags(tags)
  return message
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

ipcMain.handle('register-email-password', async (event, email, password1, password2) => {
  var response = {emailHashStored:false, passwordHashStored:false, error:''}
  if(email && password1 == password2) 
  {
    try 
    {
      //hash email and password
      var emailHash = authCrud.hash(email)
      var passwordHash = authCrud.hash(password1)

      //send email to verify address
      var code = uuidv4()

      sendVerificationEmail(email, code)

      //store email and password hashes
      const emailHashStored = await authCrud.storeEmailHash(emailHash)
      const passwordHashStored = await authCrud.storePasswordHash(passwordHash)
      return response = {emailHashStored, passwordHashStored, error:''}
    } 
    catch (error:any) 
    {
      printFormatted('red',error.message)
      return {error:error.message}
    }
  }
  if (!email) 
  { 
    response.emailHashStored = false
    response.error = 'Email not present'
  }
  if (!(password1 == password2)) 
  { 
    response.passwordHashStored = false
    response.error += 'Passwords do not match.' 
  }
  return response
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

ipcMain.handle('email-stored-boolean', async () => {
  var emailHashStored:string|undefined = await authCrud.retrieveEmailHash()
  if(emailHashStored) 
  {
    return true
  }
  else 
  {
    return false
  }
})