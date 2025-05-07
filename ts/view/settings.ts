import { ipcRenderer } from 'electron';
import { activate } from './load-themes';
import { checkPasswordProtection, setPasswordProtection } from './switch/password-switch'; 
import { loadRegisterEmailPasswordDialog } from './fragments/load-fragments';

//SECTION - Theme Buttons
/** Constants */ //these are relative to the html page 'settings.html'
const DARK_THEME = "../css/dark_mode.css"
const DEFAULT_THEME = "../css/main.css"
const LEAFY_THEME = "../css/leafy.css"

/** CSS */

/** Theme Buttons */
var btn_default_theme = document.querySelector('#btn-default-theme') as HTMLDivElement
var btn_dark_theme = document.querySelector('#btn-dark-theme') as HTMLDivElement
var btn_leafy_theme = document.querySelector('#btn-leafy-theme') as HTMLDivElement

//DEFAULT BUTTON
btn_default_theme ?  
enableThemeButton(btn_default_theme,DEFAULT_THEME) :
console.warn('btn_default_theme is null')


//DARK THEME BUTTON
btn_dark_theme ?
enableThemeButton(btn_dark_theme,DARK_THEME) :
console.warn('btn_dark_theme is null')


//LEAFY THEME BUTTON
btn_leafy_theme ?
enableThemeButton(btn_leafy_theme,LEAFY_THEME) :
console.warn('btn_leafy_theme is null')

/** 
 * Function to set theme buttons onclick with
 * activate function.
 * Note: the activate function (inside this function)
 * sets the theme of the app.
*/
function enableThemeButton(button:HTMLDivElement, theme:string)
{
    button.onclick = () => activate(theme);
}



//SECTION - Password Protection 
checkPasswordProtection()//whether or not password protection switch should be checked

const btn_password_protection_false = document.querySelector('#no-password') as HTMLDivElement
const btn_password_protection_true = document.querySelector('#password-protection') as HTMLDivElement
btn_password_protection_false.onclick = () =>  setPasswordProtection('false')
btn_password_protection_true.onclick = () =>  { 
    //set password protection to true if email is already 
    if (emailIsVerified() && passwordIsSet()) {
        setPasswordProtection('true') 
    }
    else {
        //take user password input
        loadRegisterEmailPasswordDialog()
        saveEmailPasswordInput()
        //NOTE:will verify the user password when they click the verify email button
    }   
}

//SECTION - Verify Email Address