/*
 * Register.ts - everything to do with registering your email & password 
 * Your password can also be toggled on and off using a switch (also handled in this file).
 */
import { ipcRenderer } from 'electron'
import { setPasswordProtection } from './switch/switch';
import { type settings } from '../settings/settings-type';
import * as fragments from './fragments/load-fragments'
import { captureKeystrokes, deleteKeystrokes, keystrokes, submitEnterListener } from './input-helpers/key-capture';
import { printFormatted } from '../other/stringFormatting';


const p1Keystrokes:keystrokes = {keys:''}
const p2Keystrokes:keystrokes = {keys:''}

//check switch status and then enable switch
var checkedStatus = checkUpdateSwitchStatus()//don't use `window.onload` - because script uses `defer`
checkedStatus.then(enableSwitch)
//load registration dialog ready for when user clicks the switch
fragments.loadRegisterEmailPasswordDialog()



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
    var epDialog = document.querySelector('#email-password-dialog') as HTMLDivElement
    const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement;
    if (switchInput.checked) { uncheckSwitch()}
    else { checkSwitch() }
}

async function uncheckSwitch() 
{
    printFormatted('blue', 'function uncheckSwitch called')
    //set switch to unchecked
    const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement;
    switchInput.checked = false
    setPasswordProtection('false')
}
//called outside the function as fetch always seems to load after it should do
function checkSwitch() 
{
    printFormatted('blue', 'function checkSwitch called')
    var epDialog = document.querySelector('#email-password-dialog') as HTMLDivElement
    //display dialog
    epDialog.style.display = 'grid'
    //get password fields
    const p1Div = epDialog.querySelector('#password1') as HTMLDivElement
    const p2Div = epDialog.querySelector('#password2') as HTMLDivElement
        /* Add listeners to the password divs - to capture the hidden character keystrokes */
    p1Div.addEventListener('keypress', function captureKeysListener(event) {captureKeystrokes(event,p1Keystrokes)})//keypress captures only 'normal' key presses (no special keys like alt or )
    p1Div.addEventListener('keydown', function deleteKeysListener(event) {deleteKeystrokes(event,p1Div,p1Keystrokes)})
    p1Div.addEventListener('keydown', function loginListener(event) {
        submitEnterListener(event, ()=>{})})//without the function, it still stops default behaviour on enter of line caret moving down

    //add enter key listener
    p2Div.addEventListener('keypress', function captureKeysListener(event) {captureKeystrokes(event,p1Keystrokes)})//keypress captures only 'normal' key presses (no special keys like alt or )
    p2Div.addEventListener('keydown', function deleteKeysListener(event) {deleteKeystrokes(event,p1Div,p1Keystrokes)})
    p2Div.addEventListener('keydown', function loginListener(event) {
        submitEnterListener(event, clickRegisterEmailPasswordButton)})//without the function, it still stops default behaviour on enter of line caret moving down//submit login on enter being pressed
    var btn_register = epDialog.querySelector('#register') as HTMLElement
    btn_register.onclick = () => clickRegisterEmailPasswordButton().then((success:boolean|undefined) => 
    {
        if (success)
        {
            //set switch to checked
            const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement;
            switchInput.checked = true
            setPasswordProtection('true')
        }
    })
    
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
    if (settings['password-protection'] == 'false') { uncheckSwitch() }
    return settings['password-protection']
}

//TODO - HOW TO PASSWORD PROTECT A FOLDER THROUGH ELECTRON - maybe chmod

export async function clickRegisterEmailPasswordButton()
{
    //get email and both password divs
    const emailDiv = document.querySelector('#email') as HTMLDivElement
    
    //take content of each div
    const email = emailDiv.innerText
    const p1 = p1Keystrokes
    const p2 = p2Keystrokes

    //alert if there is no email
    if(!email) {alert('No email present')}

    //send a message to user to say whether passwords match
    if (p1 != p2)
    {
        alert('Passwords do not match. Please enter the same password twice.')
    }

    //register passwords if the do match and alert the user
    else if (email && p1 == p2) 
    {
        const response =  await ipcRenderer.invoke('register-email-password', email, p1, p2)
        const { emailHashStored, passwordHashStored, error } = response
        if (error) { alert(error)}
        else if (emailHashStored && passwordHashStored) 
        { 
            alert('Email and password registered successfully. Please remember this password and email for future use.')
            return true
        }
        else { return false }
    }
}

