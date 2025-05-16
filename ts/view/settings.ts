import { ipcRenderer } from 'electron';
import { activate } from './load-themes';
import { checkPasswordProtection, setPasswordProtection } from './switch/password-switch'; 
import { loadRegisterEmailPasswordDialog, customPrompt } from './fragments/load-fragments';
import { emailIsVerified } from 'ts/email/verify-email';
import { passwordFileExists as passwordIsSet } from 'ts/security/auth-crud';
import { printFormattedv2 } from 'printformatted-js';
import { openResetCodeDialog } from './login';

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

//Code for password protection switch, verify email button and everything to do with authentication is in register.ts

var btn_reset_password = document.querySelector('#btn-reset-password') as HTMLDivElement
var btn_verify_reset_code = document.querySelector('#btn-verify-password-reset-code') as HTMLDivElement //TODO //IMPORTANT
btn_reset_password.onclick = clickButtonResetPassword
btn_verify_reset_code.onclick = openResetCodeDialog

/**
 * Code to be executed when the reset password buttom is clicked.
 * Pulls up a prompt fir 
 */
async function clickButtonResetPassword() {
    var node = false
    var trace = false
    printFormattedv2(node, trace, 'blue', '#btn-reset-password pressed')
    //open customPrompt - to enter email and then retrieve email from it
    var message = 'Enter email to send reset code'
    var placeholder = 'email@email.com'
    var email = await customPrompt(message, placeholder) 
    //if email not empty and matches saved email, send email
    if (email != '') {
        if (await emailMacthesEmailHash(email)) {
            ipcRenderer.send('send-reset-password-email', email)
            //and then
            //ipcRenderer.on('open-reset-password-confirm-prompt', openResetPasswordConfirmPrompt) - is in login.ts
        }
        else {//if email doesn't match
            alert('Wrong email entered. Email does not match stored email for user.')
        }
    }
}
async function emailMacthesEmailHash(email:string) {
    var matches = await ipcRenderer.invoke('email-matches-email-hash',email)
    return matches
}
