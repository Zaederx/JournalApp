import { ipcRenderer } from "electron"
import { blurBackground, unblurBackground } from "./create-entry/background-blur"
import { clickRegisterEmailPasswordButton } from "./register"
import * as fragments from './fragments/load-fragments'
import { printFormatted } from '../other/stringFormatting'
import { captureKeystrokes, deleteKeystrokes, pasteWithoutStyle, submitEnterListener } from "./input-helpers/key-capture"

passwordReminderOrLogin()//only works if not in a dialog

ipcRenderer.on('set-inDialog', (event:Electron.IpcRendererEvent, bool:'true'|'false') => {
    printFormatted('blue', 'set-inDialog called')
    window.localStorage.setItem('inDialog', bool)
    //send message that inDialog value is persisted
    ipcRenderer.send('set-inDialog-done')
})
/**
 * Needed for login dialog and registration (email and password) dialog
 */
type keystrokes = {keys:string}
const loginPasswordKeystrokes:keystrokes = {keys:''}
const regPasswordkeystrokes1:keystrokes = {keys:''}//for email password dialog #password 
const regPasswordkeystrokes2:keystrokes = {keys:''}//for email password dialog #password 2

//SECTION - LOGIN PROCESS
ipcRenderer.on('open-login-dialog', openLoginDialog)//check
//OR send reminder to setup login
ipcRenderer.on('register-password-reminder', registerPasswordReminder)//check

//SECTION - RESET PASSWORD PROCESS
//1) prompt the user for their email that they registered with
//put in login instead of register - because login.ts is already attached to every page
ipcRenderer.on('open-reset-password-confirm-prompt', openPasswordConfirmPrompt)

//2) open reset code dialog and send to ipcMain
ipcRenderer.on('open-reset-code-dialog', openResetCodeDialog)

//3) open the email and password dialog box - (register email and password dialog)
ipcRenderer.on('open-email-password-dialog', openEmailPasswordDialog)



/**
 * Fires an ipc message to `password-reminder-?`.
 * This then diecides what dialog to show the user upon opening the app.
 * Whether it be to login, or to request a reset of the password.
 */
async function passwordReminderOrLogin()
{
    printFormatted('blue', 'function passwordReminderOrLogin called')
    console.log('do we need a password setup reminder?')
    console.log('...or should we be asking for authentication?')
    console.log('so sending password-reminder-? ipc message')
    //check whether the user is in a dialog/presented a dialog
    var inDialog = window.localStorage.getItem('inDialog')
    console.info('inDialog:'+inDialog)
    //if not in a dialog send a reminder
    if (inDialog == 'false' || inDialog == null) 
    {
        ipcRenderer.send('password-reminder-?');
    }
}

/**
 * Click submit on the reset code dialog
 */
async function clickSubmitResetCode() 
{
    printFormatted('blue', 'function clickSubmitResetCode called')
    console.warn('function clickSubmitResetCode called')
    //take reset code div
    const reset_code_div  = document.querySelector('#reset-code-div') as HTMLDivElement
    //get it's input
    var code = reset_code_div.innerText
    //send to ipcMain to be checked before opening password dialog
    ipcRenderer.send('does-reset-code-match-?',code)
    //set inDialog to false
    window.localStorage.setItem('inDialog','false')
}

async function openResetCodeDialog() 
{
    printFormatted('blue', 'open-reset-code-dialog')
    //store whether the user is in a dialog
    window.localStorage.setItem('inDialog', 'true')
    //display load reset code dialog
    var resetCodeDialog = await fragments.loadResetCodeDialog()
    //set each editable div to not paste the style of what is copy pasted
    resetCodeDialog.querySelectorAll('.editable').forEach((div) => {
        div?.addEventListener('paste', pasteWithoutStyle)
    })
    //enable reset code dialog
    const btn_enter_code = document.querySelector('#enter-code') as HTMLDivElement
    btn_enter_code ? btn_enter_code.onclick = clickSubmitResetCode : console.log('btn_enter_code is null')
}

async function openEmailPasswordDialog() 
{
    printFormatted('blue', 'open-reset-code-dialog')
    //store whether the user is in a dialog
    window.localStorage.setItem('inDialog', 'true')
    var epDialog = await fragments.loadRegisterEmailPasswordDialog()
    epDialog.style.display = 'grid'
    //enable register password button from email-password dialog
    const btn_register = epDialog.querySelector('#register') as HTMLDivElement
    btn_register ? btn_register.onclick = clickRegisterEmailPasswordButton : console.log('btn_register is null')

    //set up toggling password visibility
    var checkbox  = epDialog.querySelector('#p-checkbox') as HTMLInputElement
    var p1 = epDialog.querySelector('#password1') as HTMLDivElement
    var p2 = epDialog.querySelector('#password2') as HTMLDivElement
    
    //toggle password visibility with checkbox input
    checkbox.onchange = () => togglePasswordVisibility(checkbox,p1,p2)

    //add listeners for password
    addPasswordListeners(p1, regPasswordkeystrokes1)
    addPasswordListeners(p2, regPasswordkeystrokes2)
    //add paste listener for each editable div
    epDialog.querySelectorAll('.editable').forEach((div) => {
        div.addEventListener('paste', pasteWithoutStyle)
    })
}

/**
 * 
 * @param element 
 */
function addPasswordListeners(element:HTMLDivElement, keystrokes:keystrokes)
{
    element.addEventListener('keypress', function captureKeysListener(event) {
        captureKeystrokes(event,keystrokes)
    }) //keypress captures only 'normal' key presses (no special keys like alt, options or meta)
    element.addEventListener('keydown',  function deleteKeysListener(event) {
        deleteKeystrokes(event,element,keystrokes)
    })
    element.addEventListener('keydown', function loginListener(event) {
        submitEnterListener(event,clickLogin)
    })
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
 * Custom prompt for user info
 * @param message message to be presented
 * @param placeholder placeholder text (optional)
 */
function customPrompt(message:string, placeholder?:string):Promise<Promise<string>>
{
    printFormatted('blue', 'function customPrompt called')
    var loadPrompt = fragments.loadCustomPrompt()

    return loadPrompt.then((customPromptDialog) => 
    {
        //display custom prompt dialog
        customPromptDialog.style.display = 'grid'
        //set message in message div
        const messageDiv = customPromptDialog.querySelector('#prompt-message') as HTMLDivElement
        messageDiv.innerText = message
        //get email div and confirm button
        const input = customPromptDialog.querySelector('#input') as HTMLDivElement
        const btn_confirm = customPromptDialog.querySelector('#confirm') as HTMLDivElement
        //set placeholder attribute on dialog
        placeholder ? input.setAttribute('data-placeholder', placeholder) : console.log('no placeholder provided for custom prompt')
        //get email from div and return the value

        //@ts-ignore
        HTMLElement.prototype.waitForClick = function(this:HTMLDivElement) 
        {
            var element = this
            return  waitForClickPromise(element,input,customPromptDialog)
        }

        //@ts-ignore
        return btn_confirm.waitForClick()
    })
}

/**
 * Open password confirm prompt with a message
 * @param event 
 * @param message message to be sent
 */
async function openPasswordConfirmPrompt(event:any,message:string)
{
    printFormatted('blue', 'open-reset-password-confirm-prompt called')
    //store whether the user is in a dialog
    window.localStorage.setItem('inDialog', 'true')
    const placeholder = 'your_email@email.com'
    const email = (await customPrompt(message, placeholder))
    console.log('email:',email)
    if (validEmail(email))
    {
        console.log('email is valid.')
        printFormatted('green','sending reset email password via ipcRenderer.send("send-reset-password-email",email)')
        //onclick - send email to ipcMain to have email to be authenticated and have a reset password email sent
        ipcRenderer.send('send-reset-password-email', email)
    }
}

/**
 * Ensures that the dialog waits submit to be pressed to take in input.
 * @param element element to add the function onto
 * @param input input field to take text in from 
 * @param promptDialog the enter dialog prompt object
 */
function waitForClickPromise(element:any,input:HTMLDivElement, promptDialog:HTMLDivElement):Promise<string> 
{
    printFormatted('blue', 'function waitForClickPromise called')
    return new Promise((resolve, reject) => 
    {
        element.addEventListener('click', () => {
            console.log('btn_confirm is clicked')
            const response = input.innerText
            if (response) 
            {
                //hide promptDialog & return email
                promptDialog.style.display = 'none'
                resolve(response)//returns the response
            }
            else 
            { 
                alert('Please do not leave the field blank.'); 
                reject(); 
            }
        })
    })
}
/**
 * Check whether an email is valid or not.
 * @param email email to be tested
 */
function validEmail(email:string)
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
    // var password = document.querySelector('#password') as HTMLDivElement
    var message = await ipcRenderer.invoke('login', loginPasswordKeystrokes.keys)
    console.log('loginPasswordKeystrokes:',loginPasswordKeystrokes.keys)
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



/**
 * Opens the loging dialog and preps it to take
 * keystrokes of input as hidden text is used 
 * for all characters
 */
async function openLoginDialog() 
{
    printFormatted('blue', 'function openLoginDialog called')
    printFormatted('green', 'opening authentication dialog...')
    //open authentication dialog
    const authDialog = await fragments.loadLoginDialog()
    authDialog.querySelectorAll('.editable').forEach((div) => {
        div.addEventListener('paste', pasteWithoutStyle)
    })
    //set btn_login
    const passwordField = authDialog.querySelector('#password') as HTMLDivElement
    const btn_login = authDialog.querySelector('#login') as HTMLDivElement
    btn_login.onclick = clickLogin
    //blur background
    const main = document.querySelector('#main') as HTMLBodyElement
    blurBackground(main)
    //add key listners for capturing keystrokes, deleting keystrokes and logging in on enter
    passwordField.addEventListener('keypress', function captureKeysListener(event) {captureKeystrokes(event,loginPasswordKeystrokes)})//keypress captures only 'normal' key presses (no special keys like alt, options or meta)
    passwordField.addEventListener('keydown', function deleteKeysListner(event) {
        var element = this
        printFormatted('green', 'this:',this)
        deleteKeystrokes(event, element, loginPasswordKeystrokes)
    })
    passwordField.addEventListener('keydown', function loginListener(event) {
    submitEnterListener(event, clickLogin)})
}



function closeAuthDialog()
{
    printFormatted('blue', 'function closeAuthDialog called')
    console.log('closing authentication dialog...')
    //open authentication dialog
    const authDialog = document.querySelector('#auth-dialog') as HTMLDivElement
    authDialog.style.display = 'none'
    //blur background
    const main = document.querySelector('#main') as HTMLBodyElement
    unblurBackground(main)
}
