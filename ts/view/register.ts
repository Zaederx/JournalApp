/*
 * Register.ts - everything to do with registering your email & password 
 * Your password can also be toggled on and off using a switch (also handled in this file).
 */
import { ipcRenderer } from 'electron'
import { setPasswordProtection } from './switch/switch';
import { type settings } from '../settings/settings-type';
import * as fragments from './fragments/load-fragments'
import { submitEnterListener } from './input-helpers/key-capture';
import { printFormatted } from '../other/printFormatted';
import { validEmail } from './login';


//check switch status and then enable switch
var checkedStatus = checkUpdateSwitchStatus()//don't use `window.onload` - because script uses `defer`
checkedStatus.then(enableSwitch)
//load registration dialog ready for when user clicks the switch
fragments.loadRegisterEmailPasswordDialog()

//enter email verification code button
var btn_verify_email = document.querySelector('#btn-verify-email-code') as HTMLDivElement
btn_verify_email ?
btn_verify_email.onclick = openVerificationCodeDialog
: printFormatted('black', 'btn_verify_email is null');

function enableSwitch()
{
    printFormatted('blue', 'function enableSwitch called')
    const btn_no_password_protection = document.querySelector('#no-password') as HTMLDivElement
    const btn_password_protection = document.querySelector('#password-protection') as HTMLDivElement
    
    const p_switch = document.querySelector('#password-switch') as HTMLDivElement
    var epDialog = document.querySelector('#email-password-dialog') as HTMLDivElement
    printFormatted('green', 'epDialog:', epDialog)
    //assign element functionality
    p_switch.onclick = toggleSwitch
    btn_no_password_protection.onclick = uncheckSwitch
    btn_password_protection.onclick = checkSwitch
}

 
//define functionality
//SECTION Toggle Password Protection
function toggleSwitch() 
{
    printFormatted('blue', 'function toggleSwitch called')
    const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement;
    if (switchInput.checked) { uncheckSwitch()}
    else { checkSwitch() } //only checks switch of registration is successful
}

async function uncheckSwitch() 
{
    printFormatted('blue', 'function uncheckSwitch called')
    //set switch to unchecked
    const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement;
    switchInput.checked = false
    setPasswordProtection('false')
}
//called outside the function as fetch always seems to load after expected
/**
 * Displays the register email password dialog
 * and if registration is successful, checked the switch.
 */
async function checkSwitch() 
{
    await fragments.loadRegisterEmailPasswordDialog()
    printFormatted('blue', 'function checkSwitch called')
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


export async function clickRegisterEmailPasswordButton() 
{
    printFormatted('blue', 'function clickRegisterEmailPasswordButton called')
    var success = await registerEmailPassword()
        
    if (success)
    {
        printFormatted('green','clickRegisterEmailPasswordButton returned successful')
        var success2 = await openVerificationCodeDialog()
        if(success2) 
        {
            printFormatted('green', 'openVerificationCodeDialog returned successful')
        } 
        else
        {
            printFormatted('green', 'openVerificationCodeDialog returned unsuccessful')
        }   
    }
    else 
    {
        printFormatted('blue', 'clickRegisterEmailPasswordButton unsuccessful')
    }
}


/**
 * Checks the settings status for password protection
 * and then updates the switch accordingly.
 * If password protection is set to false, it will set
 * the switch to unchecked.
 */
async function checkUpdateSwitchStatus()
{
    const settingsJson:string = await ipcRenderer.invoke('get-settings-json')
    var settings = JSON.parse(settingsJson) as settings
    if (settings['password-protection'] == 'false') { 
        //set visual switch to false
        const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement;
        switchInput.checked = false
     }
    return settings['password-protection']
}

//TODO - HOW TO PASSWORD PROTECT A FOLDER THROUGH ELECTRON - maybe chmod

export async function registerEmailPassword()
{
    printFormatted('blue', 'function clickRegisterEmailPasswordButton called')
    //get email and both password divs
    const emailDiv = document.querySelector('#email') as HTMLDivElement
    
    //take content of each div
    const email = emailDiv.innerText
    const p1 = document.querySelector('#password1')?.innerHTML
    const p2 = document.querySelector('#password2')?.innerHTML
    printFormatted('green', 'email:', email, '\np1:', p1, '\np2:', p2)
    //alert if there is no email
    if(!email) {alert('No email present')}

    //send a message to user to say whether passwords match
    if (p1 != p2)
    {
        alert('Passwords do not match. Please enter the same password twice.')
    }

    //register passwords if the do match and alert the user
    else if (validEmail(email) && p1 == p2) //IMPORTANT add password validator
    {
        const response =  await ipcRenderer.invoke('register-email-password', email, p1, p2)
        const { emailHashStored, passwordHashStored, error } = response
        if (error) { alert(error)}
        else if (emailHashStored && passwordHashStored) 
        { 
            alert('Email and password registered successfully. Please remember this password and email for future use.')
            //remove dialog
            const selector = '#email-password-dialog'
            const classList = ['dialog', 'email-password-dialog']
            fragments.hideFragment(selector, classList)
            var success = true
            return success
        }
        else 
        { 
            var success = false
            return success 
        }
    }
    return false
}

/**
 * Open verify email dialog and send
 * 'check-verification-code' ipc message
 * with the verification code on confirm.
 * 
 * @return returns whether verification was successful
 */
export async function openVerificationCodeDialog():Promise<boolean> {
    printFormatted('blue', 'function openVerifyEmailDialog called')
    //load dialog into the DOM
    const message = 'Please enter your email verification code into the field/box provided.'
    const placeholder = 'verification code'
    const verificationCode = await fragments.customPrompt(message, placeholder)
    //check verification code
    const valid = await ipcRenderer.invoke('check-verification-code', verificationCode)
    //activate switch if valid
    if (valid)
    {
        printFormatted('green', 'verification code returned successfully')
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