import { ipcRenderer } from "electron"
import { blurBackground, unblurBackground } from "./create-entry/background-blur"


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

ipcRenderer.on('register-password-reminder', () => {
    console.log('registering password reminder...')
    const message = 'Please go to settings to password protect your application. Otherwise please check the option under settings to "use without password".'
    alert(message)
})

//Function Defintions
async function loadAuthDialog()
{
    console.log('loading authentication dialog...')
    //load password dialog - fetching it from files
    const authDialog = await (await fetch('./fragments/authentication-dialog.html')).text()
    console.log('authDialog:'+authDialog)
    document.querySelector('#auth-dialog')!.outerHTML = authDialog
}

async function login() 
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
    btn_login.onclick = login
    //blur background
    const main = document.querySelector('#main') as HTMLBodyElement
    blurBackground(main)
}

function closeAuthDialog()
{
    //open authentication dialog
    const authDialog = document.querySelector('#auth-dialog') as HTMLDivElement
    authDialog.style.display = 'none'
    //blur background
    const main = document.querySelector('#main') as HTMLBodyElement
    unblurBackground(main)
}