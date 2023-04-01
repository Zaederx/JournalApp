import { ipcRenderer } from 'electron';
import { setPasswordProtection } from './switch/switch';
import { activate } from './load-themes';
import { type settings } from '../settings/settings-type';
//SECTION - Theme Buttons
/** Constants */ //these are relative to the html page 'settings.html'
const DARK_THEME = "../css/dark_mode.css"
const DEFAULT_THEME = "../css/main.css"
const LEAFY_THEME = "../css/leafy.css"

/** CSS */

/** Theme Buttons */
var btn_default_theme
var btn_dark_theme
var btn_leafy_theme
//DEFAULT BUTTON
if (document.querySelector('#btn-default-theme'))
{
    btn_default_theme = document.querySelector('#btn-default-theme') as HTMLButtonElement;
    activateButton(btn_default_theme,DEFAULT_THEME)
}
else
{
    btn_default_theme = null;
}
//DARK THEME BUTTON
if (document.querySelector('#btn-dark-theme'))
{
    btn_dark_theme = document.querySelector('#btn-dark-theme') as HTMLButtonElement;
    activateButton(btn_dark_theme,DARK_THEME)
}
else
{
    btn_dark_theme = null;
}

//LEAFY THEME BUTTON
if (document.querySelector('#btn-leafy-theme'))
{
    btn_leafy_theme = document.querySelector('#btn-leafy-theme') as HTMLButtonElement;
    activateButton(btn_leafy_theme,LEAFY_THEME)
}
else
{
    btn_leafy_theme = null;
}

/** Function to set buttons onclick with
 * activate function 
*/
function activateButton(button:HTMLButtonElement, theme:string)
{
    button.onclick = () => activate(theme);
}


//SECTION Toggle Password Protection
//declare html element constants
window.onload = () => checkUpdateSwitchStatus()
const btn_no_password = document.querySelector('#no-password') as HTMLDivElement
const btn_password_protection = document.querySelector('#password-protection') as HTMLDivElement
const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement;
const p_switch = document.querySelector('#password-switch') as HTMLDivElement

//assign element functionality
p_switch.onclick = toggleSwitch
btn_no_password.onclick = uncheckSwitch
btn_password_protection.onclick = checkSwitch


//define functionality
function toggleSwitch() {
    if (switchInput.checked) { uncheckSwitch()}
    else { checkSwitch() }
}
function uncheckSwitch() 
{
    switchInput.checked = false
    setPasswordProtection('false')
}
function checkSwitch() 
{
    switchInput.checked = true
    setPasswordProtection('true')
    var promise = loadPasswordDialog()

    promise.then(() => {
        var p1 = document.querySelector('#password1') as HTMLDivElement
        var p2 = document.querySelector('#password2') as HTMLDivElement
        var btn_register = document.querySelector('#register') as HTMLElement

        btn_register.onclick = () => registerPassword(p1,p2)
    })
}


async function loadPasswordDialog()
{
    //load password dialog - fetching it from files
    const passwordDialog = await (await fetch('./fragments/password-dialog.html')).text()
    document.querySelector('#password-dialog')!.outerHTML = passwordDialog
}
async function registerPassword(p1:HTMLDivElement,p2:HTMLDivElement)
{
    //send password1 and password2 to be registered if they match
    if (p1.innerText == p2.innerText)
    {
        var message = await ipcRenderer.invoke('register-password', p1.innerText, p2.innerText) as string
        alert(message);
        //hide password dialog
        var passwordDialog = document.querySelector('#password-dialog') as HTMLDivElement
        passwordDialog.style.display = 'none'
        
        //clear password1 and password2 contenteditable divs
        p1.innerText = ''
        p2.innerText = ''
    }
    else
    {
        alert('Passwords do not match.')
    }
    
}

/**
 * Checks the settings status for passowrd protection
 * and then updates the switch accordingly
 */
async function checkUpdateSwitchStatus()
{
    const settingsJson:string = await ipcRenderer.invoke('get-settings-json')
    var settings = JSON.parse(settingsJson) as settings
    if (settings['password-protection'] == 'false') { uncheckSwitch() }
}