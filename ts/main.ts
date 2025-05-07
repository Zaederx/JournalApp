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
//Other
import * as theme from './theme/theme'
import dateStr from './entry/crud/dateStr'
import { appendEntriesAndTags } from './view/append/append-entries-tags'
import process from 'process'
import c_process from 'child_process'
import Entry from './classes/entry';
import { setCurrentEntry, getCurrentEntry } from './view/create-entry/current-entry'
import { Settings } from './settings/settings-type'
import { printFormatted } from './other/printFormatted'
import { createAllTagDirectory, isThereAFile } from './fs-helpers/helpers';
import createWindow from './other/create-window'
import { sendResetPasswordEmail, sendVerificationEmail } from './security/send-email'
import { authenticationAction, userCanAccessInitially } from './security/auth-action'
import { importTransferData, exportTransferData } from './entry/export/transfer-data'
import SendSingleEntryFunctionMessage from './classes/send-single-entry-function-message';
import { setEmailVerifiedTxt, getEmailVerifiedTxt } from './verify-email/verify-email'
//IMPORTANT - Add birthtime (number) to entry files - so that when an entry is is transfered across systems it still load in correct order (as system btime is dependent on file creation date within that specific system). Could save a birthtime.json with the filename nad the original birthtime. Maybe an EntryDate stored as json.

//TODO - option to store file in iCloud
//TODO - SEND AND EMAIL IN NODE.JS - temporary password for login recovery

//NOTE - `ipcMain.handle` works with `ipcRenderer.invoke`. `ipcMain.on` works with `ipcRenderer.send`
// `on` (from ipcMain, ipcRenderer and window.webContents) works with `send` (from ipcMain `event.reply`, ipcRenderer and window.webContents)

let window: BrowserWindow;

var integration = true;

app.whenReady().then(async () => { 
  createAllTagDirectory()
  window = await createWindow(integration)
  const url = window.webContents.getURL();
  printFormatted('yellow', 'url:',url)
  
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

//Export Entries
ipcMain.handle('export-entries', () => {
  window.loadFile('html/export.html')
})
//Edit settings //TODO - maybe add the theme to the settings file instead of having a separate file for it.
ipcMain.handle('settings-view', () => {
  window.loadFile('html/settings.html')
})

/**
 * JavaScript for setting inDialog local storage item to false.
 * Item/variable is used to know whether a popup dialog is open.
 * These are used for things to do with authentication and can't
 * disappear when the window is closed and reopened.
 * This helps to make sure the dialogs don't disappear.
 */
const setInDialogFalse = 'localStorage.setItem("inDialog","false")'
app.on('window-all-closed', async() => {
  printFormatted('blue', 'app.on(window-all-closed) was called/fired')
  userCanAccess.is = false
  //quit completely even on darwin (mac) if it is a test
  if (process.env.NODE_ENV === 'test') {
    /* means that the dialog popups will not disappear after the window is closed 
    and reopened */
    await window.webContents.executeJavaScript(setInDialogFalse) 

    //quit app when done setting the value of inDialog on frontend
    app.quit()
  }
  else if (process.platform !== 'darwin') {
    printFormatted('yellow', 'on mac system')
    await window.webContents.executeJavaScript(setInDialogFalse) 
    app.quit()
  }
});



/**
 * This is need for window to be reopened once closed. (as mac app hang on the dock when closed, waiting to be reopened - from my understanding)
 * "Emitted when the application is activated. Various actions can trigger this event, such as launching the application for the first time, attempting to re-launch the application when it's already running, or clicking on the application's dock or taskbar icon." - electronjs.org
 */
app.on('activate', async (event) => {
  printFormatted('blue', 'app.on(activate) was called/fired')
  if (BrowserWindow.getAllWindows().length === 0) {
    window = await createWindow(integration);
  }
  
  //check whether password protection is enabled
  //if not user can access app straight away
  userCanAccess.is = await userCanAccessInitially()
});

/**
 * before quit 
 */
app.on('before-quit', async() => {
  printFormatted('blue', 'event "before-quit" was fired')
  userCanAccess.is = false
  await window.webContents.executeJavaScript(setInDialogFalse) 
  process.exit(0)
})

/**For Windows
 * Activated if the app closes suddenly without
 * quitting properly. i.e. control + c being pressed in terminal
 * or force quit.
 */
process.on('SIGINT', async () => {
  printFormatted('blue', 'event "SIGINT" was fired')
  await window.webContents.executeJavaScript(setInDialogFalse) 
  process.exit(0)//0 means it exited successfully
})

/**
 * Fired when the window is blurred from the frontend
 * when a popup is displayed. These popups always are trying to 
 * establish some kind of authetication, so 
 * we set the `userCanAccess.is` to false
 */
app.on('browser-window-blur', () => {
  userCanAccess.is = false
})

/**
 * important in determining whether to present
 * password dialog
 */
// const windowJustOpened = {is:false}
app.on('browser-window-focus', () => {
  printFormatted('blue','app.on("browser-window-focus") has been triggered')
  // loggedIn.is = false //setting loggedin to false allows auth-dailog to appear
 
  //if on mac - because x doesn't quit app - reload window to trigger password reminder again (which comes on page script load)
  // window.reload()//reloading the page will trigger 'authentication-action' in login.ts - making auth-dialog appear

})




/**
   * 
   * Append entries and tags to the side-panel
   */
ipcMain.on('ready-to-show-sidepanel', async (event) => appendEntriesAndTags(event,dirs.allEntries,dirs.tagDirectory))

/**
 * In short: whether the use can access the app.
 * A constant object which has a changeble boolean 
 * value which is evaulated to determine whether a 
 * user can access the app.
 * If attribute `is` is true, the user can access the app.
 * (Making it constant means that you can't change
 * what type of object it is, but you can still
 * change attibute values.)
 */
const userCanAccess = {is:false}
ipcMain.handle('login', async (event, password) => {
  printFormatted('blue', 'ipcMain.handle(login) called')
  //authenticate password
  var authenticated = await authCrud.authenticatePassword(password)
  if (authenticated) 
  {
    userCanAccess.is = true
    printFormatted('green', 'userCanAccess.is:',userCanAccess.is)

    return 'success'
  }
  else
  {
    return 'Password not authenticated. Please enter a valid password.'
  }
})

ipcMain.handle('logout', () => {
  printFormatted('blue', 'ipcMain.handle(logout called','logout')
  userCanAccess.is = false
  printFormatted('red', 'loggedIn.is:',userCanAccess.is)
})








//IMPORTANT:waits for event from ts/view/create-entry/login.ts
ipcMain.on('authentication-action',(event) => authenticationAction(event,userCanAccess))

//SECTION - Set Password Protection - True or False


//SECTION - Reset Password - 3 parts
//1) check the email matches and send reset code
ipcMain.on('send-reset-password-email', async (event, email) => {
  printFormatted('blue', 'ipcMain.on(send-reset-password-email)')
  const message = 'Email does not match stored email.\nPlease enter the email used for this application.'
  //if email matches stored email hash
  const emailAuthenticated = await authCrud.authenticateEmail(email)
  //send email with reset code to user email
  if (emailAuthenticated)
  {
    // uuidv4 code & hash the code
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
      sendResetPasswordEmail(email,code)//IMPORTANT uncomment later - commented for testing purposes
      
      //open reset code dialog - for them to input the code they recieved in email
      event.reply('open-reset-code-dialog')
    }
    
   
    //event.reply('open-reset-code-dialog')//IMPORTANT - DELETE LATER
  }
  else//send them back to step 1) the form to input their email to be checked
  {
    printFormatted('green', 'Email did not match stored email.')
    event.reply('open-reset-password-confirm-prompt', message)
  }
})

//2 do codes match
ipcMain.on('does-reset-code-match-?', doesRestCodeMatch)

async function doesRestCodeMatch(event:IpcMainEvent, resetCode:string)
{
  printFormatted('blue', 'does-reset-code-match listener fired')
  var codesMatch = await authCrud.authenticateResetCode(resetCode)
  printFormatted('white', 'do reset codes match...')
  if(codesMatch)
  {
    printFormatted('green', 'Yes. code given matches stored code.')
    printFormatted('green', 'Opening register email password dialog.')
    printFormatted('green', 'Close reset code dialog')
    //progress to step 3 - open the email password dailog box
    event.reply('open-register-email-password-dialog')
  }
  else
  {
    printFormatted('red', 'No. Code given does not match stored code.')
    printFormatted('red', 'Opening reset code dialog.')
    //go back to step 2 - open the reset code dialog
    event.reply('open-reset-code-dialog')
  }
}

/**
 * Checks validity of verification code.
 * Verifies the email address by checking the verification
 * code.
 */
ipcMain.handle('check-verification-code', async (event, verificationCode) => {
  printFormatted('blue', 'function checkVerificationCode called')
  const valid = await authCrud.authenticateEmailVerificationCode(verificationCode)
  
  if (valid) {
    setEmailVerifiedTxt('true')
    printFormatted('green', 'verification code is valid')
  }
  else {
    printFormatted('green', 'verification code is invalid')
  }
  return valid
})
//step 3
//SECTION -REGISTER EMAIL AND PASSWORDS
//or step 1 if email and password are not set
ipcMain.handle('register-email-password', async (event, email, password1, password2) => {
  var response = {emailHashStored:false, passwordHashStored:false, codeHashStored:false,error:''}
  if(email && password1 == password2) 
  {
    try 
    {
      //hash email and password
      var emailHash = authCrud.hash(email)
      var passwordHash = authCrud.hash(password1)

      //send email to verify address
      var code = uuidv4()
      var codeHash = authCrud.hash(code)
      sendVerificationEmail(email, code)

      //store email and password hashes
      const emailHashStored = await authCrud.storeEmailHash(emailHash)
      const passwordHashStored = await authCrud.storePasswordHash(passwordHash)
      const codeHashStored = await authCrud.storeVerificationCodeHash(codeHash)
      printFormatted('yellow', 'verification code:',code)
      return response = {emailHashStored, passwordHashStored, codeHashStored, error:''}
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



/**
 * Returns whether the email has been verified.
 * Returns a boolean.
 */
ipcMain.handle('email-is-verified', async () => {
  return await getEmailVerifiedTxt()
})


ipcMain.on('enable-navigation-?', async (event) => {
  printFormatted('blue', 'ipcMain.on("enable-navigation-?" fired')
  printFormatted('white','enable navigation attempt:')
  await authenticationAction(event,userCanAccess)
  if(userCanAccess.is == true) {
    printFormatted('green','enabling navigation...')
    event.reply('enable-navigation')
  }
  else
  {
    printFormatted('red','declining to enable navigation...')
  }
})


//






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

/**
 * Sets the current entry 
 */
ipcMain.handle('set-current-entry', (event, selectedEntryName) => setCurrentEntry(selectedEntryName))


/** Returns the current entry as a json string.
 */
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
  //the path to the send-entries.js script
  const pathToScript = paths.join(__dirname, 'view', 'append', 'send-entries.js')
  //start a child proces
  var childProcess = c_process.fork(pathToScript, [allEntries, tagDirectory, tagName], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })

  //recieve messages from child process on this the main process & send/forward to renderer process
  childProcess.on('message', (message:SendSingleEntryFunctionMessage|'start-loader'|'stop-loader') => {
    //@ts-ignore
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
  var promise: OpenDialogReturnValue = await dialog.showOpenDialog({title:'Export Entries', defaultPath:dialogPath, properties:['openFile', 'multiSelections'] })

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



//SECTION - SETTINGS 
ipcMain.handle('get-settings', async (event, jsonStr:boolean=false)=> {
  printFormatted('blue', 'handle "get-settings" called')
  var settings = await Settings.retrieveSettings(jsonStr) as string
  printFormatted('green','retrieved settings:',settings)
  return settings
})

ipcMain.handle('set-settings', async (event, settings) => {
  printFormatted('blue', 'handle "set-settings" called')
  printFormatted('green','saving settings:',settings)
  var message = await Settings.saveSettingsJson(settings)
  return message
})

ipcMain.handle('email-stored-boolean', async () => {
  printFormatted('blue', 'email-stored-boolean called/fired')
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


/**
 * Export for tarnsfer to new another 'The Journal App' journal.
 * For instance if the computer needs to be backed up or wiped,
 * you can simply export the entire `tagDirs` folder/directory and all of the tags
 */
//IMPORTANT
ipcMain.handle('export-transfer-data', () => {
  exportTransferData(dirs.allEntries, dirs.downloads)
})

ipcMain.handle('import-transfer-data', () => {
  importTransferData(dirs.downloads, dirs.allEntries)
})