import { ipcRenderer } from "electron"
import { blurBackground, unblurBackground } from "./create-entry/background-blur"

import { clickRegisterEmailPasswordButton } from "./register"
import * as fragments from './fragments/load-fragments'
import { printFormatted } from '../other/printFormatted'
import { pasteWithoutStyle, submitEnterListener } from "./input-helpers/key-capture"
import { customPrompt } from "./fragments/load-fragments"
import { setPasswordProtection } from "./switch/password-switch"
import { printFormattedv2, colour} from "printformatted-js"

//call this once on opening - for first script load
// passwordReminderOrLogin()

function setInDialog(bool:'true'|'false') {
    window.localStorage.setItem('inDialog', bool)
}
function getInDialog() {
    return window.localStorage.getItem('inDialog')
}

/* IMPORTANT Note: inDialog in localStorage is set to false
 * in two locations:
 * - clickLogin (when it logs in successfully)
 * - clickSubmitResetCode
 * 
 * Used to know when a dialog
 * (text prompt and input fields) is still open.
 * It is set to true whenever one of the dialogs is called. (The dialog is the pop up window where you
 * input information).
 * The variable is there to prevent the window from
 * closing the dialog when the window
 * goes out of focus and back into focus.
 * 
 * 
 */

//everytime on focus - doesn't get called on first script load for some reason
window.onfocus = () => 
{
    printFormatted('yellow', 'window.onfocus called')
    printFormatted('yellow', 'window.location.href:', window.location.href)
    printFormatted('green', 'getInDialog():',getInDialog())
    if (getInDialog() == 'false')
    {
        printFormatted('red', 'inDialog is false')
        passwordReminderOrLogin()
    }
}



//SECTION - LOGIN PROCESS - initialted by passwordOrLoging function call at the top of this script
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

//or 1) and then
// 2) open verification code dialog
// ipcRenderer.on('open-verification-code-dialog', (event, email) => { openVerificationCodeDialog(email) })//check



/**
 * Fires an ipc message to `authentication-action`.
 * This then decides what dialog to show the user upon opening the app (whether it be to login, or to request a reset of the password).
 * If no password has been set, or if password
 * authentication is not enabled, this does not
 * show a dialog
 */
async function passwordReminderOrLogin()
{
    printFormatted('blue', 'function passwordReminderOrLogin called')
    console.log('do we need a password setup reminder?')
    console.log('...or should we be asking for authentication?')
    console.log('so sending authentication-action ipc message')
    ipcRenderer.send('authentication-action');
}


//TODO - make sure that all inputs pastWithoutStyle -   
//set each editable div to not paste the style of what is copy pasted
// dialog.querySelector('.editable')!.addEventListener('paste', pasteWithoutStyle)

// async function openResetCodeDialog() 
// {
//     printFormatted('blue', 'function openResetCodeDialog called')
//     window.localStorage.setItem('inDialog', 'true')
//     //display load reset code dialog
//     await fragments.loadResetCodeDialog()
//     var resetCodeDialog = document.querySelector('#reset-code-dialog') as HTMLDivElement
//     resetCodeDialog.style.display = 'grid'
//     //set each editable div to not paste the style of what is copy pasted
//     resetCodeDialog.querySelector('.editable')!.addEventListener('paste', pasteWithoutStyle)
//     //enable reset code dialog
//     const btn_enter_code = document.querySelector('#enter-code') as HTMLDivElement
//     btn_enter_code ? btn_enter_code.onclick = clickSubmitResetCode : console.log('btn_enter_code is null')
// }
/**
 * Opens the reset code dialog, where you can enter the code
 * to reset your password.
 */
export async function openResetCodeDialog() {
    printFormatted('blue', 'function openResetCodeDialog called')
    setInDialog('true')
    //display load reset code dialog
    var message = 'Enter password reset code.'
    var placeholder = 'reset code'
    var code = await fragments.customPrompt(message,placeholder)
    // clickSubmitResetCode
    //send to ipcMain to be checked before opening password dialog
    ipcRenderer.send('does-reset-code-match-?', code)
    setInDialog('false')
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
    setInDialog('false')
    //hide the fragment
    fragments.removeFragment('#reset-code-dialog', ['dialog'])
    //send to ipcMain to be checked before opening password dialog
    ipcRenderer.send('does-reset-code-match-?',code)
}

async function openRegisterEmailPasswordDialog() 
{
    printFormatted('blue', 'function openRegisterEmailPasswordDialog called')
    //store whether the user is in a dialog
    setInDialog('true')
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

    epDialog.querySelector('#password2')

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
    setInDialog('true')
    const placeholder = 'your_email@email.com'
    const email = (await customPrompt(message, placeholder))
    window.localStorage.setItem('inDialog', 'false')
    //close custom prompt
    console.log('email:',email)
    if (validEmail(email))
    {
        console.log('email is valid.')
        fragments.removeFragment('#custom-prompt', ['dialog'])
        printFormatted('green','sending reset email password via ipcRenderer.send("send-reset-password-email",email)')
        //onclick - send email to ipcMain to have email to be authenticated and have a reset password email sent
        ipcRenderer.send('send-reset-password-email', email)
    }
    else
    {
        alert('Email was not a valid email. Please enter a valid email.')
        fragments.removeFragment('#custom-prompt', ['dialog'])
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

/**
 * Displays register password reminder prompt.
 */
async function registerPasswordReminder() 
{
    printFormatted('blue', 'function registerPasswordReminder called')
    console.log('registering password reminder...')
    const message = 'Please go to settings to password protect your application. Otherwise please enter "disable reminder" and click ok to remove password reminder.'
    setInDialog('true')
    var response = await customPrompt(message)
    setInDialog('false')
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
        setInDialog('false')
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
    //set inDialog to true - so that passwordReminderOrLogin doesnt trigger
    setInDialog('true')
    //blur background
    const main = document.querySelector('#main') as HTMLBodyElement
    blurBackground(main)
    //open authentication dialog
    await fragments.loadLoginDialog()
    var loginDialog = document.querySelector('#login-dialog') as HTMLDivElement
    loginDialog.style.display = 'grid'
    
    /**
     * Sets the editable divs (email and password divs) 
     * to not paste
     */
    document.querySelectorAll('.editable').forEach((div) => {
        div.addEventListener('paste', pasteWithoutStyle)
    })
    //set btn_login
    const passwordField = document.querySelector('#password') as HTMLDivElement
    const btn_login = document.querySelector('#btn-login') as HTMLDivElement
    btn_login.onclick = clickLogin

    //allows login button to be clicked on pressing `enter` while in the password field
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
        setInDialog('true')
        //change to the settings view if not already there
        console.log('window.location.href:', window.location.href)
        if (!(window.location.href.includes('settings.html'))) {
            alert('You, will now be taken to the settings page. \nPlease click the "Reset Password" button, to begin the processes of resetting your forgotten password.')
            ipcRenderer.invoke('settings-view') 
        }
        //openResetPasswordConfirmPrompt(event, message_forgot_password)//doesn't work because we've switch to another page by then.
    } :
    printFormatted('black', 'btn_forgot_password is null')
}

/**
 * Closes the loging dialog
 */
function closeLoginDialog()
{
    printFormatted('blue', 'function closeLoginDialog called')
    console.log('closing login dialog...')
    //close login dialog
    var selector = '#login-dialog'
    var classList = ['dialog','login-dialog']
    fragments.removeFragment(selector, classList)
    //blur background
    const main = document.querySelector('#main') as HTMLBodyElement
    unblurBackground(main)
}

// function clickForgotPasswordBtn() {
//     printFormatted('blue', 'function clickForgetPasswordBtn called')
//     closeLoginDialog()

//     //change view to settings view
//     ipcRenderer.invoke('settings-view')
//     //activate reset password function which will ask for the user's email and handle all the rest.
//     clickButtonResetPassword()
//     //(if email matches stored email hash - send email to address with reset code)
// }

/**
 * Code to be executed when the reset password button is clicked.
 * Pulls up a prompt for entering email.
 */
export async function clickButtonResetPassword() {
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
            //ipcRenderer.on('open-reset-code-dialog') - is activated if successful
            //if email doesn't match...
            //ipcRenderer.on('open-reset-password-confirm-prompt', openResetPasswordConfirmPrompt) - is activated to call up the prompt again to enter email
        }
        else {//if email doesn't match
            alert('Wrong email entered. Email does not match stored email for user.')
        }
    }
}
/**
 * Returns true if email matches stored email hash
 * @param email email to check
 * @returns 
 */
export async function emailMacthesEmailHash(email:string) {
    var matches = await ipcRenderer.invoke('email-matches-email-hash',email)
    return matches
}