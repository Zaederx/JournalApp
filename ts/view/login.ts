import { ipcRenderer } from "electron"
import { blurBackground, unblurBackground } from "./create-entry/background-blur"
import { settings } from '../settings/settings-type'
var passwordKeystrokes = ''
window.onload = () => {
    var promise = loadAuthDialog()
    promise.then(()=> {
        console.log('do we need a password setup reminder?')
        console.log('...or should we be asking for authentication?')
        console.log('so sending password-reminder-? ipc message')
        ipcRenderer.send('password-reminder-?')
    })
}

ipcRenderer.on('open-authentication-dialog', openAuthDialog)

ipcRenderer.on('register-password-reminder', registerPasswordReminder)

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
    var message = await ipcRenderer.invoke('login', passwordKeystrokes)
    console.log('passwordKeystrokes:',passwordKeystrokes)
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
    const passwordField = document.querySelector('#password') as HTMLDivElement
    const btn_login = document.querySelector('#login') as HTMLDivElement
    btn_login.onclick = clickLogin
    //blur background
    const main = document.querySelector('#main') as HTMLBodyElement
    blurBackground(main)
    //add enter key listner
    passwordField.addEventListener('keypress', captureKeystrokes)//keypress captures only 'normal' key presses (no special keys like alt or )
    const onBubbleUp = false
    passwordField.addEventListener('keyup', deleteKeyStrokes, onBubbleUp)
    passwordField.addEventListener('keydown', loginEnterListener)
}

function deleteKeyStrokes(event:KeyboardEvent)
{
    const passwordField = document.querySelector('#password') as HTMLDivElement
    var keyname = event.key
    //if backspace is pressed - delete the previous keystroke
    if (keyname == 'Backspace')
    {
        console.log('backspace pressed')
        //get password length
        var p_length = passwordField.innerText.length//needs to be minus one -> because doesn't register the backspace till after
        var s_length = passwordKeystrokes.length
        const first_char = 0

        // const diff = difference(p_length,s_length)
        console.log('p_length:'+p_length)
        console.log('s_length:'+s_length)
        // console.log('difference:'+diff)
         //function should only return positive difference
        
        //remove anything beyong p_length
        passwordKeystrokes = passwordKeystrokes.slice(first_char,p_length)//also needs to be minus 1
        var s_length = passwordKeystrokes.length
        console.log('s_length after slice:'+s_length)
        
        console.log('passwordKeystrokes:'+passwordKeystrokes)
    }
}

function captureKeystrokes(event:KeyboardEvent)
{
    console.log('function captureKeyStrokes listener')
    var keyname = event.key
    // var keycode = event.code
    //save password keystrokes
    passwordKeystrokes += keyname
    console.log('passwordKeystrokes:'+passwordKeystrokes)
}

function difference(p_length:number,s_length:number)
{
    var difference
    if(p_length > s_length)
    {
        difference = p_length - s_length
    }
    else
    {
        difference = s_length - p_length
    }
    return difference
}

function loginEnterListener(event: KeyboardEvent)
{
    console.log('function loginEnterLister called')
    var keyname = event.key
    var keycode = event.code
    // console.log('keyname:'+keyname+', keycode:'+keycode)
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
    console.log('closing authentication dialog...')
    //open authentication dialog
    const authDialog = document.querySelector('#auth-dialog') as HTMLDivElement
    authDialog.style.display = 'none'
    //blur background
    const main = document.querySelector('#main') as HTMLBodyElement
    unblurBackground(main)
    //remove enter key listener
    document.removeEventListener('keydown', loginEnterListener)
}