import { ipcRenderer } from "electron"
import { blurBackground, unblurBackground } from "./create-entry/background-blur"
import { settings } from '../settings/settings-type'

window.onload = () => {
    var promise = loadAuthDialog()
    promise.then(()=> {
        console.log('do we need a password setup reminder?')
        console.log('...or should we be asking for authentication?')
        console.log('so sending password-reminder-? ipc message')
        ipcRenderer.send('password-reminder-?')
    })
}

ipcRenderer.on('open-authentication-dialog', () => openAuthDialog())

ipcRenderer.on('register-password-reminder', () => registerPasswordReminder())

async function registerPasswordReminder() 
{
    console.log('registering password reminder...')
    const message = 'Please go to settings to password protect your application. Otherwise please enter "disable reminder" and click ok to remove password reminder.'
    var response = prompt(message)
    if (response == 'disable reminder')
    {
        //change settings - disable reminder
        var settings = await ipcRenderer.invoke('get-settings-json') as settings
        //stringify to json str
        var settingsJson = JSON.stringify(settings) 
        //set to main to to persisted/saved to file
        var message2 = await ipcRenderer.invoke('set-settings-json', settingsJson)
        console.log(message2)
        //TODO - make sure to update program to not trigger reminder if 
    }
}

//Function Defintions
async function loadAuthDialog()
{
    console.log('loading authentication dialog...')
    //load password dialog - fetching it from files
    const authDialog = await (await fetch('./fragments/authentication-dialog.html')).text()
    console.log('authDialog:'+authDialog)
    document.querySelector('#auth-dialog')!.outerHTML = authDialog
}

/**
 * Used to login to the application.
 * Once login button is clicked, password from contenteditable div
 * is passed to the ipcRenderer on the login channel.
 */
async function clickLogin() 
{
    //get password and send to be logged in
    var password = document.querySelector('#password') as HTMLDivElement
    var message = await ipcRenderer.invoke('login', password.innerText)
    if(message == 'success') 
    {
        alert('Login successful.')
        closeAuthDialog()//close authentication dialog
        //attempt to enable navigation
        console.log('enabling navigation...')
        ipcRenderer.send('enable-navigation-?')
    }
    else 
    {
        alert(message)
    }
    
}

function openAuthDialog() 
{
    console.log('opening authentication dialog...')
    //open authentication dialog
    const authDialog = document.querySelector('#auth-dialog') as HTMLDivElement
    authDialog.style.display = 'grid'
    //set btn_login
    const btn_login = document.querySelector('#login') as HTMLDivElement
    btn_login.onclick = clickLogin
    //blur background
    const main = document.querySelector('#main') as HTMLBodyElement
    blurBackground(main)
    //add enter key listner
    document.addEventListener('keydown', loginEnterListener)
}

function loginEnterListener(event: KeyboardEvent)
{
    var keyname = event.key
    var keycode = event.code
    console.log('keyname:'+keyname+', keycode:'+keycode)
    if (keyname == 'Enter')
    {
        //prevent it from having caret movement - i.e. no text cursor movement down
        event.preventDefault()
        //login
        clickLogin()
    }
}
function closeAuthDialog()
{
    //open authentication dialog
    const authDialog = document.querySelector('#auth-dialog') as HTMLDivElement
    authDialog.style.display = 'none'
    //blur background
    const main = document.querySelector('#main') as HTMLBodyElement
    unblurBackground(main)
    //remove enter key listener
    document.removeEventListener('keydown', loginEnterListener)
}