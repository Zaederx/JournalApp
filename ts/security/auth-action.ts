import { passwordFileExists } from './auth-crud'
import { settings } from '../settings/settings-type'
import { Settings } from '../settings/settings'
import { printFormatted } from '../other/printFormatted'
//IMPORTANT - double check the logic in authentication action and account for more senarios if needed.
/**
 * A functions for main.ts (ipcMain) that decides what dialog to open
 * based on the password protection settings.
 * There are 4 scenarios:
 * - Open the login/authentication dialog popup (if password proection is enabled and the user is not already logged in/userCanAccess.is = false)
 * - Login the user without password (if password protection not enabled), but display a password setup reminder (if reminders are enabled)
 * - Login the user without a password, but don't display a reminder
 * - Don't login in the user
 * 
 * @param event IpcMainEvent
 * @param userCanAccess object for checking whether the user is allowed to access the app or loggedIn
 * @param windowJustOpened an object for checking whether the window just opened
 */
export async function authenticationAction(event:Electron.IpcMainEvent, userCanAccess:{is:boolean})
{
  printFormatted('blue','authentication-action triggered')
  const passwordExists:boolean = await passwordFileExists()
  const jsonStr = false
  const settings:settings = await Settings.retrieveSettings(jsonStr) as settings

  printFormatted('green','settings:',settings)
  //print passwordExists
  if (passwordExists) printFormatted('green','passwordExists:',passwordExists) 
  else printFormatted('red','passwordExists:',passwordExists)
  //print userCanAccess.is
  if (userCanAccess.is == true) printFormatted('green','userCanAccess.is:',userCanAccess.is)
  else printFormatted('red','userCanAccess.is:',userCanAccess.is)
 

 

  //open authentication dialog
  if (passwordExists && settings['password-protection'] == 'true' && userCanAccess.is == false)
  {
    printFormatted('green','password file exists')
    printFormatted('green','password protection is set to true')
    printFormatted('green','loggedIn is set to false')
    printFormatted('green','opening login dialog...')
    // windowJustOpened.is = false
    event.reply('open-login-dialog')
  }
  //send reminder and enable navigation - set userCanAccess.is to true
  else if(settings['password-protection'] == 'false' && settings['password-reminder'] == 'true')
  {
    userCanAccess.is = true//enable login - they are effectively logged in if there is no password set up
    if (!passwordExists) 
    {
      printFormatted('yellow','password file does not exist') 
    }
    printFormatted('green','userCanAccess.is now set to:'+userCanAccess.is)
    printFormatted('green','Showing password reminder and enabling navigation...')
    
    //show reminder
    event.reply('register-password-reminder')
    event.reply('enable-navigation')//send message to nav.ts to enable
  }
  //enable navigation without sending a reminder
  else if (settings['password-protection'] == 'false' && settings['password-reminder'] == 'false') {
    printFormatted('green','Enabling navigation...')
    // windowJustOpened.is = false
    userCanAccess.is = true
    event.reply('enable-navigation')//send message to nav.ts to enable
  }
  //if password does not exist and password protection is true - tampering has most likely occured - alert user and prompt to reset password via email
  else if (!passwordExists && settings['password-protection'] == 'true')
  {
    //alert user to problem and that they will receive an email with a reset code
    const message = 'Password file is missing.\n This could be the sign of something malicious.\n Please reset your password by entering your email address you gave upon registration.\n An email will be sent. Be sure to check your bin or spam folder just in case you do not find the mail in your inbox.'

    

    printFormatted('yellow', 'Alerting user of missing password file and reset mesaures.')
    event.reply('open-reset-password-confirm-prompt', message)
  }
}

/**
 * Checks whether the user can access the app initially.
 * Basically, at the start if no password protection is enabled,
 * it can give the user access right away without checking credentials.
 * @param userCanAccess 
 */
export async function userCanAccessInitially() {
  printFormatted('blue','function userCanAccessInitially called')
  const passwordExists:boolean = await passwordFileExists()
  const jsonStr = false
  const settings:settings = await Settings.retrieveSettings(jsonStr) as settings

  printFormatted('green','settings:',settings)

  if(passwordExists && settings['password-protection'] == 'true') {
    return false
  }
  else {
    return true
  }
}