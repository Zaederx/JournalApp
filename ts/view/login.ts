import { ipcRenderer } from "electron"
import { blurBackground, unblurBackground } from "./create-entry/background-blur"
import { settings } from '../settings/settings-type'
import { clickRegisterEmailPasswordButton } from "./register"
import * as fragments from './fragments/load-fragments'
import { printFormatted } from '../other/stringFormatting'

passwordReminderOrLogin()//only works if not in a dialog

ipcRenderer.on('set-inDialog', (event:Electron.IpcRendererEvent, bool:'true'|'false') => {
    printFormatted('blue', 'set-inDialog called')
    window.localStorage.setItem('inDialog', bool)
    //send message that inDialog value is persisted
    ipcRenderer.send('set-inDialog-done')
})
/**
 * Needed for login dialog function
 */
var passwordKeystrokes = ''

//SECTION - LOGIN PROCESS
ipcRenderer.on('open-login-dialog', openLoginDialog)
//OR send reminder to setup login
ipcRenderer.on('register-password-reminder', registerPasswordReminder)

//SECTION - RESET PASSWORD PROCESS
//1) prompt the user for their email that they registered with
//put in login instead of register - because login.ts is already attached to every page
ipcRenderer.on('open-reset-password-confirm-prompt', openPasswordConfirmPrompt)

//2) open reset code dialog and send to ipcMain
ipcRenderer.on('open-reset-code-dialog', openResetCodeDialog)

//3) open the email and password dialog box
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
    await fragments.loadResetCodeDialog()
    //enable reset code dialog
    const btn_enter_code = document.querySelector('#enter-code') as HTMLDivElement
    btn_enter_code ? btn_enter_code.onclick = clickSubmitResetCode : console.log('btn_enter_code is null')
}

async function openEmailPasswordDialog() 
{
    printFormatted('blue', 'open-reset-code-dialog')
    //store whether the user is in a dialog
    window.localStorage.setItem('inDialog', 'true')
    await fragments.loadEmailPasswordDialog()
    //enable register password button from email-password dialog
    const btn_register = document.querySelector('#register') as HTMLDivElement
    btn_register ? btn_register.onclick = clickRegisterEmailPasswordButton : console.log('btn_register is null')
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

    return loadPrompt.then(() => 
    {
        //display prompt
        const promptDialog = document.querySelector('#custom-prompt') as HTMLDivElement
        promptDialog.style.display = 'grid'
        //set message in message div
        const messageDiv = document.querySelector('#prompt-message') as HTMLDivElement
        messageDiv.innerText = message
        //get email div and confirm button
        const dialog = document.querySelector('#dialog') as HTMLDivElement
        const btn_confirm = document.querySelector('#confirm') as HTMLDivElement
        //set placeholder attribute on dialog
        placeholder ? dialog.setAttribute('data-placeholder', placeholder) : console.log('no placeholder provided for custom prompt')
        //get email from div and return the value

        //@ts-ignore
        HTMLElement.prototype.waitForClick = function(this:HTMLDivElement) 
        {
            var element = this
            return  waitForClickPromise(element,dialog,promptDialog)
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

function waitForClickPromise(element:any,dialog:HTMLDivElement, promptDialog:HTMLDivElement):Promise<string> 
{
    printFormatted('blue', 'function waitForClickPromise called')
    return new Promise((resolve, reject) => 
    {
        element.addEventListener('click', () => {
            console.log('btn_confirm is clicked')
            const response = dialog.innerText
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
            printFormatted('yellow', 'settingsJson:',settingsJson)
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

/**
 * Opens the loging dialog and preps it to take
 * keystrokes of input as hidden text is used 
 * for all characters
 */
function openLoginDialog() 
{
    printFormatted('blue', 'function openLoginDialog called')
    printFormatted('green','opening authentication dialog...')
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
    //add key listners for capturing keystrokes, deleting keystrokes and logging in on enter
    passwordField.addEventListener('keypress', captureKeystrokes)//keypress captures only 'normal' key presses (no special keys like alt, options or meta)
    passwordField.addEventListener('keyup', deleteKeystrokes)
    passwordField.addEventListener('keydown', loginEnterListener)
}

/**
 * Deletes keys from var `captureKeystrokes` when characters are deleted
 * from password div.
 * Characters in password div are all the same circle and cannot be used for passwords.
 * To capture actually key press character, the captureKeystrokes function is used.
 * To delete these acurally requires the use of this `deleteKeystrokes` function
 * @param event keyboard event
 */
function deleteKeystrokes(event:KeyboardEvent)
{
    printFormatted('blue', 'function deleteKeystrokes called')
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
    printFormatted('blue', 'function captureKeystrokes called')
    var keyname = event.key
    // var keycode = event.code
    //save password keystrokes
    passwordKeystrokes += keyname
    console.log('passwordKeystrokes:'+passwordKeystrokes)
}


function loginEnterListener(event: KeyboardEvent)
{
    printFormatted('blue','function loginEnterLister called')
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
    printFormatted('blue', 'function closeAuthDialog called')
    console.log('closing authentication dialog...')
    //open authentication dialog
    const authDialog = document.querySelector('#auth-dialog') as HTMLDivElement
    authDialog.style.display = 'none'
    //blur background
    const main = document.querySelector('#main') as HTMLBodyElement
    unblurBackground(main)
}

