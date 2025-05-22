import { activate } from './load-themes';
import { clickButtonResetPassword, openResetCodeDialog } from './login';
import { openVerificationCodeDialog } from './register';
//Note:Code for password protection switch and everything to do with authentication is in register.ts
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


//declare buttons authentication buttons
var btn_verify_email_code = document.querySelector('#btn-verify-email-code') as HTMLDivElement
var btn_reset_password = document.querySelector('#btn-reset-password') as HTMLDivElement
var btn_verify_reset_code = document.querySelector('#btn-verify-password-reset-code') as HTMLDivElement
//enable authentication buttons - if buttons are null, print message
btn_verify_email_code ? btn_verify_email_code.onclick = openVerificationCodeDialog: console.log('btn_verify_email_code is null')
btn_reset_password ? btn_reset_password.onclick = clickButtonResetPassword : console.log('btn_reset_password is null')
btn_verify_reset_code ? btn_verify_reset_code.onclick = openResetCodeDialog : console.log('btn_verify_reset_code is null')