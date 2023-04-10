/*
 * Register.ts - everything to do with registering your email & password 
 * Your password can also be toggled on and off using a switch (also handled in this file).
 */
import { ipcRenderer } from 'electron'
import { setPasswordProtection } from './switch/switch';
import { type settings } from '../settings/settings-type';
import * as fragments from './fragments/load-fragments'

var checkedStatus = checkUpdateSwitchStatus()//don't use `window.onload` - because script uses `defer`

checkedStatus.then(enableSwitch)

function enableSwitch()
{
    const btn_no_password_protection = document.querySelector('#no-password') as HTMLDivElement
    const btn_password_protection = document.querySelector('#password-protection') as HTMLDivElement
    
    const p_switch = document.querySelector('#password-switch') as HTMLDivElement

    //assign element functionality
    p_switch.onclick = toggleSwitch
    btn_no_password_protection.onclick = uncheckSwitch
    btn_password_protection.onclick = checkSwitch
}

 
//define functionality
//SECTION Toggle Password Protection
function toggleSwitch() 
{
    const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement;
    if (switchInput.checked) { uncheckSwitch()}
    else { checkSwitch() }
}

async function uncheckSwitch() 
{
    //set switch to unchecked
    const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement;
    switchInput.checked = false
    setPasswordProtection('false')
}

async function checkSwitch() 
{
    const loadEPDialog = loadEmailPasswordDialog()

    loadEPDialog.then(() => 
    {
        const p1Div = document.querySelector('#password1') as HTMLDivElement
        const p2Div = document.querySelector('#password2') as HTMLDivElement
         /* Add listeners to the password divs - to capture the hidden character keystrokes */
        p1Div.addEventListener('keypress', captureKeystrokes)//keypress captures only 'normal' key presses (no special keys like alt or )
        p1Div.addEventListener('keyup', deleteKeyStrokes)
        p1Div.addEventListener('keydown', loginEnterListener)

        //add enter key listener
        p2Div.addEventListener('keypress', captureKeystrokes)//keypress captures only 'normal' key presses (no special keys like alt or )
        p2Div.addEventListener('keyup', deleteKeyStrokes)//when keys are deleted
        p2Div.addEventListener('keydown', loginEnterListener)//submit login on enter being pressed
        var btn_register = document.querySelector('#register') as HTMLElement
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
    })
}


async function loadEmailPasswordDialog()
{
    //load password dialog - fetching it from files
    const passwordDialog = await (await fetch('./fragments/password-dialog.html')).text()
    document.querySelector('#password-dialog')!.outerHTML = passwordDialog
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
}

//TODO - HOW TO PASSWORD PROTECT A FOLDER THROUGH ELECTRON - maybe chmod
var p1Keystrokes = ''
var p2Keystrokes = ''
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

function deleteKeyStrokes(event:KeyboardEvent)
{
    const passwordField = document.querySelector('#password') as HTMLDivElement
    var keyname = event.key
    //if backspace is pressed - delete the previous keystroke
    if (keyname == 'Backspace')
    {
        console.log('backspace pressed')
        //get password length
        var p_length = passwordField.innerText.length//needs to be minus one -> because doesn't register the backspace till after
        var s_length = p1Keystrokes.length
        const first_char = 0

        // const diff = difference(p_length,s_length)
        console.log('p_length:'+p_length)
        console.log('s_length:'+s_length)
        // console.log('difference:'+diff)
         //function should only return positive difference
        
        //remove anything beyong p_length
        p1Keystrokes = p1Keystrokes.slice(first_char,p_length)//also needs to be minus 1
        var s_length = p1Keystrokes.length
        console.log('s_length after slice:'+s_length)
        
        console.log('passwordKeystrokes:'+p1Keystrokes)
    }
}

function captureKeystrokes(event:KeyboardEvent)
{
    console.log('function captureKeyStrokes listener')
    var keyname = event.key
    // var keycode = event.code
    //save password keystrokes
    p2Keystrokes += keyname
    console.log('passwordKeystrokes:'+p2Keystrokes)
}


function loginEnterListener(event: KeyboardEvent)
{
    console.log('function loginEnterLister called')
    var keyname = event.key
    var keycode = event.code
    // console.log('keyname:'+keyname+', keycode:'+keycode)
    if (keyname == 'Enter')
    {
        //prevent it from having caret movement - i.e. no text cursor movement down
        event.preventDefault()
        //login
        clickRegisterEmailPasswordButton()
    }
}