import { ipcRenderer } from "electron"
import { blurBackground, unblurBackground } from "./create-entry/background-blur"
import { openVerificationCodeDialog, clickRegisterEmailPasswordButton } from "./register"
import * as fragments from './fragments/load-fragments'
import { printFormatted } from '../other/stringFormatting'
import { pasteWithoutStyle, submitEnterListener } from "./input-helpers/key-capture"
import { customPrompt } from "./fragments/load-fragments"

//once on opening - for first script load
passwordReminderOrLogin()

//everytime on focus - doesn't get called on first script load for some reason
window.onfocus = () => 
{
    if (window.localStorage.getItem('inDialog') == 'false')
    {
        passwordReminderOrLogin()
    }
}


/* Note: inDialog in localStorage is set to false
 * in two locations:
 * - clickLogin (when it logs in successfully)
 * - clickSubmitResetCode
 * 
 * It is set to true whenever one of the dialog is called.
 * It is there to prevent the window from closing the dialog when the window
 * goes out of focus and back into focus.
 */

window.onload = () => {
    printFormatted('blue','window.onload fired')
    //enter email verification code button
    var btn_verify_email = document.querySelector('#btn-verify-email-code') as HTMLDivElement
    btn_verify_email ?
    btn_verify_email.onclick = openVerificationCodeDialog :
    printFormatted('black', 'btn_verify_email is null')
}
//SECTION - LOGIN PROCESS
ipcRenderer.on('open-login-dialog', openLoginDialog)//check
//OR send reminder to setup login
ipcRenderer.on('register-password-reminder', registerPasswordReminder)//check

//SECTION - RESET PASSWORD PROCESS
//1) prompt the user for their email that they registered with
ipcRenderer.on('open-reset-password-confirm-prompt', openResetPasswordConfirmPrompt)

//2) open reset code dialog and send to ipcMain
ipcRenderer.on('open-reset-code-dialog', openResetCodeDialog)

//3) open the register email and password dialog box - (register email and password dialog)
//SECTION - REGISTER EMAIL AND PASSWORDS
//if password is not set, this is step 1)
ipcRenderer.on('open-register-email-password-dialog', openRegisterEmailPasswordDialog)//check

// 2) open verification code dialog
ipcRenderer.on('open-verification-code-dialog', openVerificationCodeDialog)//check








/**
 * Fires an ipc message to `authentication-action`.
 * This then diecides what dialog to show the user upon opening the app.
 * Whether it be to login, or to request a reset of the password.
 */
async function passwordReminderOrLogin()
{
    printFormatted('blue', 'function passwordReminderOrLogin called')
    console.log('do we need a password setup reminder?')
    console.log('...or should we be asking for authentication?')
    console.log('so sending authentication-action ipc message')
    ipcRenderer.send('authentication-action');
}



/**
 * Opens the reset code dialog
 */
async function openResetCodeDialog() 
{
    printFormatted('blue', 'function openResetCodeDialog called')
    window.localStorage.setItem('inDialog', 'true')
    //display load reset code dialog
    await fragments.loadResetCodeDialog()
    var resetCodeDialog = document.querySelector('#reset-code-dialog') as HTMLDivElement
    resetCodeDialog.style.display = 'grid'
    //set each editable div to not paste the style of what is copy pasted
    resetCodeDialog.querySelector('.editable')!.addEventListener('paste', pasteWithoutStyle)
    //enable reset code dialog
    const btn_enter_code = document.querySelector('#enter-code') as HTMLDivElement
    btn_enter_code ? btn_enter_code.onclick = clickSubmitResetCode : console.log('btn_enter_code is null')
}

/**
 * Sends ipc message with reset code to 
 * `does-reset-code-match-?` to check validity.
 * That handler in turn sends a message to 
 * `open-email-password-dialog` if code is valid or
 * back to `open-reset-code-dialog` if it is not.
 */
async function clickSubmitResetCode() 
{
    printFormatted('blue', 'function clickSubmitResetCode called')
    console.warn('function clickSubmitResetCode called')
    //take reset code div
    const reset_code_div  = document.querySelector('#reset-code-div') as HTMLDivElement
    //get it's input
    var code = reset_code_div.innerText
    //set inDialog to false
    window.localStorage.setItem('inDialog','false')
    //hide the fragment
    fragments.hideFragment('#reset-code-dialog', ['dialog'])
    //send to ipcMain to be checked before opening password dialog
    ipcRenderer.send('does-reset-code-match-?',code)
}

async function openRegisterEmailPasswordDialog() 
{
    printFormatted('blue', 'function openRegisterEmailPasswordDialog called')
    //store whether the user is in a dialog
    window.localStorage.setItem('inDialog', 'true')
    await fragments.loadRegisterEmailPasswordDialog()
    var epDialog = document.querySelector('#email-password-dialog') as HTMLDivElement
    epDialog.style.display = 'grid'

    //set up toggling password visibility
    var checkbox  = epDialog.querySelector('#p-checkbox') as HTMLInputElement
    var p1 = epDialog.querySelector('#password1') as HTMLDivElement
    var p2 = epDialog.querySelector('#password2') as HTMLDivElement

    //toggle password visibility with checkbox input
    checkbox.onchange = () => togglePasswordVisibility(checkbox,p1,p2)

    epDialog.querySelectorAll('.editable').forEach((div) => {
        div.addEventListener('paste', pasteWithoutStyle)
    })

    //enable register password button from email-password dialog
    //invokes register-email-password dialog onclick if fields are valid
    const btn_register = epDialog.querySelector('#register') as HTMLDivElement
    btn_register ? 
    btn_register.onclick = clickRegisterEmailPasswordButton : 
    console.log('btn_register is null')
}

/**
 * 
 * @param checkbox checkbox input
 * @param p1 password1 input
 * @param p2 password2 input (for double checking that password1 is entered correctly)
 */
function togglePasswordVisibility(checkbox:HTMLInputElement, p1:HTMLDivElement, p2: HTMLDivElement)
{
    //if checked = uncheck
    if(checkbox.checked) 
    {
        checkbox.checked = false
        hidePassword(p1,p2)
    }
    else 
    {
        checkbox.checked = true
        showPassword(p1,p2)
    }
}

function hidePassword(p1:HTMLDivElement, p2:HTMLDivElement)
{
    p1?.classList.add('password')
    p2?.classList.add('password')
}

function showPassword(p1:HTMLDivElement, p2:HTMLDivElement)
{
    p1?.classList.remove('password')
    p2?.classList.remove('password')
}

//TODO - add boolean option for password visibility


/**
 * Open password confirm prompt with a message to enter 
 * the email used to register.
 * If a valid email is recieved, an ipc message is sent to
 * `send-reset-password-email` with that email.
 * That in turn fires at `open-reset-code-dialog` if email matches saved email
 * or `reset-password-confirm-prompt` if it does not match.
 * @param
 * @param message message to be sent
 */
async function openResetPasswordConfirmPrompt(event:any, message:string)
{
    printFormatted('blue', 'open-reset-password-confirm-prompt called')
    //store whether the user is in a dialog
    window.localStorage.setItem('inDialog', 'true')
    const placeholder = 'your_email@email.com'
    const email = (await customPrompt(message, placeholder))
    //close custom prompt
    
    console.log('email:',email)
    if (validEmail(email))
    {
        console.log('email is valid.')
        fragments.hideFragment('#custom-prompt', ['dialog'])
        printFormatted('green','sending reset email password via ipcRenderer.send("send-reset-password-email",email)')
        //onclick - send email to ipcMain to have email to be authenticated and have a reset password email sent
        ipcRenderer.send('send-reset-password-email', email)
    }
    else
    {
        alert('Email was not a valid email. Please enter a valid email.')
        fragments.hideFragment('#custom-prompt', ['dialog'])
        openResetPasswordConfirmPrompt(null, message)
    }
}


/**
 * Check whether an email is valid or not.
 * @param email email to be tested
 */
export function validEmail(email:string)
{
    const validate = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
    return validate.test(email)
}

async function registerPasswordReminder() 
{
    printFormatted('blue', 'function registerPasswordReminder called')
    console.log('registering password reminder...')
    const message = 'Please go to settings to password protect your application. Otherwise please enter "disable reminder" and click ok to remove password reminder.'
    var response = await customPrompt(message)//TODO USE CUSTOM PROMPT
    if (response == 'disable reminder')
    {
        printFormatted('green', 'disabling reminder message')
        //change settings - disable reminder
        var gotSettings =  ipcRenderer.invoke('get-settings-json')

        gotSettings.then( async (settingsJsonStr:string) => {
            //parse string to an object
            var settings = JSON.parse(settingsJsonStr)
            //set password reminder to false
            settings["password-reminder"] = 'false'
            //stringify to json str
            var settingsJson = JSON.stringify(settings) 
            //remove escape characters
            settingsJson.replaceAll('\\','')
            printFormatted('green', 'settingsJson:',settingsJson)
            //set to main to be persisted/saved to file
            var message2 = await ipcRenderer.invoke('set-settings-json', settingsJson)
            printFormatted('green',message2)
        })
        
    }
}

//Function Defintions

/**
 * Used to login to the application.
 * Once login button is clicked, password from contenteditable div
 * is passed to the ipcRenderer on the login channel.
 */
async function clickLogin() 
{
    printFormatted('blue', 'function clickLogin called')
    
    //get password and send to be logged in
    var password = document.querySelector('#password') as HTMLDivElement
    var message = ipcRenderer.invoke('login', password.innerHTML) 
    printFormatted('green','loginPasswordKeystrokes:',password.innerHTML)
    if(await message == 'success') 
    {
        //inDialog false
        window.localStorage.setItem('inDialog','false')
        alert('Login successful.')
        closeLoginDialog()//close authentication dialog
        //attempt to enable navigation
        console.log('enabling navigation...')
        ipcRenderer.send('enable-navigation-?')
    }
    else 
    {
        alert(await message)
    }

}

/**
 * Opens the login dialog and preps it to take
 * keystrokes of input as hidden text is used 
 * for all characters
 */
async function openLoginDialog() 
{
    printFormatted('blue', 'function openLoginDialog called')
    printFormatted('green', 'opening authentication dialog...')
    //blur background
    const main = document.querySelector('#main') as HTMLBodyElement
    blurBackground(main)
    //open authentication dialog
    await fragments.loadLoginDialog()
    var loginDialog = document.querySelector('#login-dialog') as HTMLDivElement
    loginDialog.style.display = 'grid'
    
    document.querySelectorAll('.editable').forEach((div) => {
        div.addEventListener('paste', pasteWithoutStyle)
    })
    //set btn_login
    const passwordField = document.querySelector('#password') as HTMLDivElement
    const btn_login = document.querySelector('#btn-login') as HTMLDivElement
    btn_login.onclick = clickLogin

    passwordField.addEventListener('keydown', function loginListener(event) {
    submitEnterListener(event, clickLogin)})

    //set forgot password
    var btn_forgot_password = document.querySelector('#btn-forgot-password') as HTMLDivElement
    const message_forgot_password = 'Please enter the email address you registered with.'

    btn_forgot_password ?
    btn_forgot_password.onclick = (event) => 
    {
        printFormatted('blue','btn_forgot_password clicked')
        closeLoginDialog()
        openResetPasswordConfirmPrompt(event, message_forgot_password)
    } :
    printFormatted('black', 'btn_forgot_password is null')
}

function closeLoginDialog()
{
    printFormatted('blue', 'function closeLoginDialog called')
    console.log('closing login dialog...')
    //close login dialog
    var selector = '#login-dialog'
    var classList = ['dialog']
    fragments.hideFragment(selector, classList)
    //blur background
    const main = document.querySelector('#main') as HTMLBodyElement
    unblurBackground(main)
}
