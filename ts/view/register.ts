/*
 * Register.ts - everything to do with registering your email & password 
 * Your password can also be toggled on and off using a switch (also handled in this file).
 */
import { ipcRenderer } from 'electron'
import { setPasswordProtection } from './switch/password-switch';
import { type settings } from '../settings/settings-type';
import * as fragments from './fragments/load-fragments'
import { submitEnterListener } from './input-helpers/key-capture';
import { printFormattedv2, colour } from 'printformatted-js';
import * as validator from './validate/validator'

/**Convienece printing method
 * Set up printFormattedv2 for use in js console
 */
function print (colour:colour, ...args:string[]) {
    const node = false
    const trace = false
    printFormattedv2(node,trace,colour,args)
}
//check switch status and then enable switch
var checkedStatus = checkUpdateSwitchStatus()//don't use `window.onload` - because script uses `defer`
checkedStatus.then(enableSwitch)
//load registration dialog ready for when user clicks the switch
fragments.loadRegisterEmailPasswordDialog()




/**
 * Enables the password protection switch.
 * (Makes it so that the switch works when you toggle it.)
 */
function enableSwitch()
{
    print('blue', 'function enableSwitch called')
    //set switch to checked or unchecked
    
    const btn_no_password_protection = document.querySelector('#no-password') as HTMLDivElement
    const btn_password_protection = document.querySelector('#password-protection') as HTMLDivElement
    
    const p_switch = document.querySelector('#password-switch') as HTMLDivElement
    var epDialog = document.querySelector('#email-password-dialog') as HTMLDivElement
    print('green', 'epDialog:', epDialog.outerHTML)
    //assign element functionality
    p_switch.onclick = toggleSwitch
    btn_no_password_protection.onclick = uncheckSwitch
    btn_password_protection.onclick = checkSwitch
}

 
//define functionality
//SECTION Toggle Password Protection
/**
 * Toggles/switches the password protection switch.
 */
function toggleSwitch() 
{
    print('blue', 'function toggleSwitch called')
    const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement;
    if (switchInput.checked) { uncheckSwitch()}
    else { checkSwitch() } //only checks switch of registration is successful
}

/**
 * Disables password protection switch.
 */
async function uncheckSwitch() 
{
    print('blue', 'function uncheckSwitch called')
    //ask for password
    var message = 'Please enter your password.'
    var placeholder = 'StrongPassword&92'
    var hideText = true
    var password = await fragments.customPrompt(message,placeholder,hideText)
    //check if password is correct
    var loginMessage = await ipcRenderer.invoke('login', password)
    if (loginMessage == 'success') {
        //set switch to unchecked if password is correct
        const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement;
        switchInput.checked = false
        setPasswordProtection('false')
        alert('Password protection switched off.')
    }
    else {
        alert('Password is incorrect.')
    }
    
}
//called outside the function as fetch always seems to load after expected
/**
 * Attemps to turn on password protection.
 * Displays the register email password dialog
 * and if registration is successful, checked the switch.
 */
async function checkSwitch() 
{
    await fragments.loadRegisterEmailPasswordDialog()
    print('blue', 'function checkSwitch called')
    //display the already loaded email password dialog
    var epDialog = document.querySelector('#email-password-dialog') as HTMLDivElement
    epDialog.style.display = 'grid'
    //get password fields
    const p1Div = epDialog.querySelector('#password1') as HTMLDivElement
    const p2Div = epDialog.querySelector('#password2') as HTMLDivElement
        /* Add listeners to the password divs - to capture the hidden character keystrokes */
  
    p1Div.addEventListener('keydown', function loginListener(event) {
        submitEnterListener(event, ()=>{})})//without the function, it still stops default behaviour on enter of line caret moving down

    p2Div.addEventListener('keydown', function loginListener(event) {
        submitEnterListener(event, clickRegisterEmailPasswordButton)})//without the function, it still stops default behaviour on enter of line caret moving down//submit login on enter being pressed
    var btn_register = epDialog.querySelector('#register') as HTMLElement
    btn_register.onclick = clickRegisterEmailPasswordButton
    
}

/**
 * Provides the code which must be executed when the
 * register email and password button is click.
 */
export async function clickRegisterEmailPasswordButton() 
{
    print('blue', 'function clickRegisterEmailPasswordButton called')
    var {success, openVCDialog, email} = await registerEmailPassword()
    console.log('success:',success, '\n','openVCDialog:',openVCDialog, '\n', 'email:',email)
    if (success && openVCDialog)
    {
        print('green','clickRegisterEmailPasswordButton returned successful')
        var success2 = await openVerificationCodeDialog()
        if(success2) 
        {
            print('green', 'openVerificationCodeDialog returned successful')
        } 
        else
        {
            print('red', 'openVerificationCodeDialog returned unsuccessful')
        }   
    }
    else if (success && !openVCDialog) {
        print('green', 'Password updated successfully.')
    }
    else //if success || openVCDialog = false
    {
        print('red', 'clickRegisterEmailPasswordButton unsuccessful')
        alert('Problem with your submission. Please try entering your information again.')
    }
    //no longer in dialog
    window.localStorage.setItem('inDialog', 'false')
}

/**
 * One of the functions called within `clickRegisterEmailPasswordButton`.
 * Thid function is the one which registers the email and password.
 * @returns response:{ success:boolean, openVCDialog:boolean }
 */
export async function registerEmailPassword():Promise<{success:boolean, openVCDialog:boolean, email:string}>
{
    print('blue', 'function clickRegisterEmailPasswordButton called')
    //get email and both password divs
    const emailDiv = document.querySelector('#email') as HTMLDivElement
    
    //take content of each div
    const email = emailDiv.innerText
    const p1 = document.querySelector('#password1')?.innerHTML as string
    const p2 = document.querySelector('#password2')?.innerHTML as string
    const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement;
    print('green', 'email:', email, '\np1:', p1, '\np2:', p2)

    //alert if there is no email
    if(!email) {alert('No email present')}

    //send a message to user to say whether passwords match
    if (p1 != p2)
    {
        alert('Passwords do not match. Please enter the same password twice.')
    }

    //validate password
    const password = validator.validPassword(p1)

    //register passwords if the do match and alert the user
    if (validator.validEmail(email) && p1 == p2 && password.valid) 
    {
        console.log('registering email and password...')
        const response:{ emailStored:boolean, passwordHashStored:boolean, codeHashStored:boolean, emailAlreadyVerified:boolean, error:string } =  await ipcRenderer.invoke('register-email-password', email, p1, p2)

        //deconstruct response object
        const { emailStored, passwordHashStored, codeHashStored, emailAlreadyVerified, error } = response
        console.log('response:',response)

        //display error message if exists
        if (error) { alert(error)}

        //if someone was just updating their password
        else if (emailAlreadyVerified && passwordHashStored) {
            //notify user 
            alert('Email was already verified. Password updated.')

            //check switch
            switchInput.checked = true
            setPasswordProtection('true')

            //remove dialog
            const selector = '#email-password-dialog'
            const classList = ['dialog', 'email-password-dialog']
            fragments.removeFragment(selector, classList)

            //return response object
            var success = true
            var openVCDialog = false //open verification code dialog
            return {success, openVCDialog, email}
        }
        else if (!emailAlreadyVerified && emailStored && passwordHashStored) 
        { 
            //notify user of status
            alert('Email and password saved. Verify email to enable password protection.')

            //remove dialog
            const selector = '#email-password-dialog'
            const classList = ['dialog', 'email-password-dialog']
            fragments.removeFragment(selector, classList)

            //return response object
            var success = true
            var openVCDialog = true //open verification code dialog
            return { success, openVCDialog, email }
        }
        else 
        { 
            var success = false
            var openVCDialog = false //open verification code dialog
            return { success, openVCDialog, email }
        }
    }
    else if (!validator.validEmail(email)) {
        alert('Invalid Email.')
    }
    var pMessage = ''//Password Message
    if (!(password.valid)) {
        if(!(password.hasLowerCaseLetter)) {
            pMessage += '❌ Missing lower case letter\n'
        }
        if(!(password.hasUpperCaseLetter)){
            pMessage += '❌ Missing uppercase letter\n'
        }
        if(!(password.hasSpecialCharacter)) {
            pMessage += '❌ Missing special character\n'
        }
        if(!(password.hasNumber)) {
            pMessage += '❌ Missing a number\n'
        }
        if(!(password.is8CharLong)) {
            pMessage += '❌ Passwords must be at least 8 characters long\n'
        }
        alert(pMessage)
    }
    
    var success = false
    var openVCDialog = false //open verification code dialog
    return { success, openVCDialog, email }
}

/**
 * Open verify email dialog and send
 * 'check-verification-code' ipc message
 * with the verification code on confirm.
 * 
 * @return returns whether verification was successful
 */
export async function openVerificationCodeDialog():Promise<boolean> {
    print('blue', 'function openVerifyEmailDialog called')
    //load dialog into the DOM
    const message = 'Please enter your email verification code into the field/box provided.'
    const placeholder = 'verification code'
    const verificationCode = await fragments.customPrompt(message, placeholder)
    var email = await ipcRenderer.invoke('get-email') as string
    console.log('email:',email)
    //check verification code
    const valid = await ipcRenderer.invoke('check-verification-code', verificationCode, email)
    //activate switch if valid
    if (valid)
    {
        print('green', 'verification code returned successfully')
        //set switch to checked
        const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement;
        if (switchInput) 
        {
            switchInput.checked = true
            setPasswordProtection('true')
        }
    }
    //authentication action - pick up 
    ipcRenderer.send('authentication-action')
    return valid
}
/**
 * Checks the settings status for password protection
 * and then updates the switch accordingly.
 * If password protection is set to false, it will set
 * the switch to unchecked. If password protection is set to true,
 * it sill set the swithc to checked.
 * @return - settings['password-protection'] {@link settings}
 */
async function checkUpdateSwitchStatus():Promise<'true'|'false'>
{
    const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement;
        
    var settings:settings = await ipcRenderer.invoke('get-settings')
    if (settings['password-protection'] == 'false') { 
        //set visual switch to false
        switchInput.checked = false
     }
     //switch set to true by default in the HTML - but this doesn't hurt
     else {
        switchInput.checked = true
     }
    return settings['password-protection'] as 'true'|'false'
}

//TODO - HOW TO PASSWORD PROTECT A FOLDER THROUGH ELECTRON



