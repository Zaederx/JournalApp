import { passwordFileExists } from './auth-crud'
import { retrieveSettings } from '../settings/settings-functions'
import { type settings } from '../settings/settings-type'
import { printFormatted } from '../other/stringFormatting'


export async function authenticationAction(event:Electron.IpcMainEvent, loggedIn:{is:boolean}, windowJustOpened:{is:boolean})
{
  printFormatted('blue','authentication-action triggered')
  const passwordExists = await passwordFileExists()
  const jsonStr = false
  const settings:settings = await retrieveSettings(jsonStr)

  printFormatted('green','settings:',settings)
  //print passwordExists
  if (passwordExists) printFormatted('green','passwordExists:',passwordExists) 
  else printFormatted('red','passwordExists:',passwordExists)
  //print loggedIn.is
  if (loggedIn.is) printFormatted('green','loggedIn.is:',loggedIn.is)
  else printFormatted('red','loggedIn.is:',loggedIn.is)
  //print windowJustOpened
  if (windowJustOpened.is) printFormatted('green','windowJustOpened:',windowJustOpened.is)
  else printFormatted('red','windowJustOpened:',windowJustOpened.is)

  //open authentication dialog
  if (passwordExists && settings['password-protection'] == 'true' && loggedIn.is == false)
  {
    printFormatted('green','password file exists')
    printFormatted('green','password protection is set to true')
    printFormatted('green','loggedIn is set to false')
    printFormatted('green','opening login dialog...')
    // windowJustOpened.is = false
    event.reply('open-login-dialog')
  }
  //send reminder and enable navigation - set loggedIn.is to true
  else if(settings['password-protection'] == 'false' && settings['password-reminder'] == 'true')
  {
    loggedIn.is = true//enable login - they are effectively logged in if there is no password set up
    
    if (!passwordExists) 
    {
      printFormatted('yellow','password file does not exist') 
    }
    printFormatted('green','loggedIn.is now set to:'+loggedIn.is)
    printFormatted('green','Showing password reminder and enabling navigation...')
    
    //show reminder
    event.reply('register-password-reminder')
    event.reply('enable-navigation')//send message to nav.ts to enable
  }
  //enable navigation without sending a reminder
  else if (settings['password-protection'] == 'false' && settings['password-reminder'] == 'false') {
    printFormatted('green','Enabling navigation...')
    // windowJustOpened.is = false
    loggedIn.is = true
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