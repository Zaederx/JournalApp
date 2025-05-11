import { ipcRenderer } from 'electron';
import { activate } from './load-themes';
import { checkPasswordProtection, setPasswordProtection } from './switch/password-switch'; 
import { loadRegisterEmailPasswordDialog } from './fragments/load-fragments';
import { emailIsVerified } from 'ts/verify-email/verify-email';
import { passwordFileExists as passwordIsSet } from 'ts/security/auth-crud';

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