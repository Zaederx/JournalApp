import { printFormatted } from "../../other/stringFormatting";
import { submitEnterListener } from "../input-helpers/key-capture";

/**
 * Hide the fragment/element given a selector for the element
 * @param selector selector for the fragment
 */
export function hideFragment(selector:string, classList:string[])
{
    printFormatted('blue', 'function hideFragment called')
    const element = document.querySelector(selector) as HTMLElement;
    classList.forEach((clazz) => {//clazz - because class is a keyword
        element.classList.remove(clazz)
    })
    element.innerHTML = ' '
}

/**
 * Loads the tags popup
 */
export async function loadTagsPopup()
{
    console.log('loadTagsPopup called...')
    //load tags popup
    const tags_popup = await (await fetch('./fragments/tags-popup.html')).text()
    document.querySelector('#tags-popup')!.outerHTML = tags_popup
}

/**
 * Loads the dialog box for password authentication.
 * Contains single password field and a login button.
 */
export async function loadLoginDialog()
{
    console.log('loading authentication dialog...')
    //load password dialog - fetching it from files
    const loginDialogHTML = await (await fetch('./fragments/login-dialog.html')).text()
    console.log('authDialog:'+loginDialogHTML)
    var loginDialog = document.querySelector('#login-dialog') as HTMLDivElement
    loginDialog.outerHTML = loginDialogHTML
    return loginDialog
}

/**
 * Loads the dailog box for entering the reset code
 * Contains single input field and an enter button
 */
export async function loadResetCodeDialog()
{
    //load password dialog - fetching it from files
    const resetCodeDialogHTML = await (await fetch('./fragments/reset-code-dialog.html')).text()
    const resetCodeDialog = document.querySelector('#reset-code-dialog') as HTMLDivElement
    resetCodeDialog!.outerHTML = resetCodeDialogHTML
    
    return resetCodeDialog
}

/**
 * Loads the dialog for registering email and password.
 * Contains 3 input fields. One for email, one for password1
 * and one for password2.
 */
export async function loadRegisterEmailPasswordDialog()
{
    const epDialog = document.querySelector('#email-password-dialog') as HTMLDivElement
    epDialog.style.display = 'none'
    //load password dialog - fetching it from files
    const response =  await fetch('./fragments/email-password-dialog.html')
    var emailPasswordDialogHTML = await response.text()
    document.querySelector('#email-password-dialog')!.outerHTML = emailPasswordDialogHTML 
    return epDialog
}

/**
 * Is a general prompt made as a substitute for the regualar
 * prompt dialog. (No implementation in Electron because it blocks the process).
 * Contains a `#prompt-message` div and one `#input` field.
 */
export async function loadCustomPrompt()
{
    //load password dialog - fetching it from files
    const customPromptHTML = await (await fetch('./fragments/custom-prompt.html')).text()
    var customPrompt = document.querySelector('#custom-prompt') as HTMLDivElement
    customPrompt.outerHTML = customPromptHTML
    
    return customPrompt
}

export async function loadVerifyEmailDialog() {
    //load password dialog - fetching it from files
    const verificationCodeHTML = await (await fetch('./fragments/verification-code.html')).text()
    var customPrompt = document.querySelector('#verification-code-dialog') as HTMLDivElement
    customPrompt.outerHTML = verificationCodeHTML
    return customPrompt
}


/**
 * Custom prompt for user info.
 * Just place a div with id `custom-prompt`
 * then when this is called, it will load the prompt into
 * the specified div.
 * @param message message to be presented
 * @param placeholder placeholder text (optional)
 */
export function customPrompt(message:string, placeholder?:string):Promise<Promise<string>>
{
    printFormatted('blue', 'function customPrompt called')
    var loadPrompt = loadCustomPrompt()

    return loadPrompt.then(() => 
    {
        //display custom prompt dialog
        var customPromptDialog = document.querySelector('#custom-prompt') as HTMLDivElement
        customPromptDialog.style.display = 'grid'
        //set message in message div
        const messageDiv = document.querySelector('#prompt-message') as HTMLDivElement
        messageDiv.innerText = message
        //get email div and confirm button
        const input = customPromptDialog.querySelector('#input') as HTMLDivElement
        const btn_confirm = customPromptDialog.querySelector('#confirm') as HTMLDivElement
        //set placeholder attribute on dialog
        placeholder ? input.setAttribute('data-placeholder', placeholder) : console.log('no placeholder provided for custom prompt')

        //stop line caret from moving downwards
        input.addEventListener('keypress', (e) => submitEnterListener(e,()=>{}))
            
        //get email from div and return the value
        //see link for detail on how this works (https://www.gimtec.io/articles/convert-on-click-to-promise/)
        //@ts-ignore - 
        HTMLElement.prototype.waitForClick = function(this:HTMLDivElement) 
        {
            var element = this
            return  waitForClickPromise(element,input)
        }

        //@ts-ignore
        return btn_confirm.waitForClick()
    })
}


/**
 * Ensures that the dialog waits submit to be pressed to take in input.
 * @param element element to add the function onto
 * @param input input field to take text in from 
 * @param promptDialog the enter dialog prompt object
 * 
 * For details on how this works see [link](https://www.gimtec.io/articles/convert-on-click-to-promise/)
 */
function waitForClickPromise(element:any, input:HTMLDivElement):Promise<string> 
{
    printFormatted('blue', 'function waitForClickPromise called')
    return new Promise((resolve, reject) => 
    {
        element.addEventListener('click', () => {
            console.log('btn_confirm is clicked')
            const response = input.innerText
            if (response) 
            {
                printFormatted('green', 'response:',response)
                //hide promptDialog & return email
                hideFragment('#custom-prompt', ['dialog'])
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

