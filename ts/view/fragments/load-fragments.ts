import { printFormattedv2, colour } from "printformatted-js";
import { pasteWithoutStyle, submitEnterListener } from "../input-helpers/key-capture";

const node = false
const trace = false
/**
 * A convinience method for printing with printFormatted with specific settings.
 * (Set to print to on frontend in the console, not node - uses difference colour code to node. Also stack trace is set to false.)
 * 
 * @param colour - The colours that you can choose from:
 * "green" | "red" | "yellow" | "white" | "black" | "blue"
 * @param args - Things you want to print. Can be as many variables as you like
 */
function print(colour:colour, ...args:string[]) {
    printFormattedv2(node,trace,colour, args)
}
/**
 * Removes the fragment/element inner HTML. Also removes CSS classes
 * from the outer HTML given a selector for the fragment/element.
 * @param selector selector for the fragment
 */
export function removeFragment(selector:string, classList:string[])
{
    print('blue', 'function hideFragment called')
    const element = document.querySelector(selector) as HTMLElement;

    //TODO check if forEach is necessary - think you can just classList.remove
    classList.forEach((clazz) => {//clazz - because class is a keyword
        element.classList.remove(clazz)
    })
    //clear the inner HTML
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
    console.log('loading login dialog...')
    //load password dialog - fetching it from files
    const loginDialogHTML = await (await fetch('./fragments/login-dialog.html')).text()
    console.log('loginDialog:'+loginDialogHTML)
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
    console.log('loading reset code dialog...')
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

    //for checkbox hide and display password
    var p1 = document.querySelector('#password1')
    var p2 = document.querySelector('#password2')
    var p_checkbox = document.querySelector('#p-checkbox') as HTMLInputElement

    p1 ? print('green','p1 is initialised') : print('green','p1 is null')
    p2 ? print('green','p2 is initialised') : print('green','p2 is null')
    p_checkbox ? print('green','p_checkbox is initialised') : print('green','p_checkbox is null')
    
    p_checkbox.oninput = () => {
      console.log('p-checkbox clicked')
     //show password
      if (p1 && p2 && p_checkbox.checked) {
         p1.classList.remove('password')
         p2.classList.remove('password')
      }
      //hide password
      else if (p1 && p2){
         p1.classList.add('password')
         p2.classList.add('password')
      }
    }
    // return document.querySelector('#email-password-dialog') - maybe this is better?
    return emailPasswordDialogHTML
}

/**
 * Is a general prompt made as a substitute for the regualar
 * prompt dialog. (No implementation in Electron because it blocks the process).
 * Contains a `#prompt-message` div and one `#input` field.
 */
export async function loadCustomPrompt()
{
    //load custom prompt dialog - fetching it from files
    const customPromptHTML = await (await fetch('./fragments/custom-prompt.html')).text()
    /*get the custom prompt div (usually empty) on
    frontend and replace it with a customPromptHtml fragment*/
    var customPrompt = document.querySelector('#custom-prompt') as HTMLDivElement
    customPrompt.outerHTML = customPromptHTML
    //because it's not empty anymore - maybe you need to query selector again
    // return document.querySelector('#custom-prompt')
    return customPrompt
}

/**
 * Loads/Displays and returns the custom prompt dialog div object.
 * @returns customPrompt dialog div
 */
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
    print('blue', 'function customPrompt called')
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

        
        //set input to not paste the style of what is copy pasted
        input.addEventListener('paste', pasteWithoutStyle)
        //get email from div and return the value
        //see link for detail on how this works (https://www.gimtec.io/articles/convert-on-click-to-promise/)
        //@ts-ignore - 
        HTMLElement.prototype.waitForInputSubmission = function(this:HTMLDivElement):Promise<string> 
        {
            var element = this
            return  waitForClickOrEnter(element,input)
        }

        //@ts-ignore
        return btn_confirm.waitForInputSubmission()
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
function waitForClickOrEnter(element:any, input:HTMLDivElement):Promise<string> 
{
    print('blue', 'function waitForClickPromise called')
    return new Promise((resolve, reject) => 
    {
        //if user click on the button element - return/resolve response
        element.addEventListener('click', () => {
            console.log('btn_confirm is clicked')
            const response = input.innerText
            if (response) 
            {
                print('green', 'response:',response)
                //hide promptDialog & return email
                removeFragment('#custom-prompt', ['dialog'])
                resolve(response)//returns the response
            }
            else 
            { 
                alert('Please do not leave the field blank.'); 
                reject(); 
            }
        })
        //stop line caret from moving downwards & submits response on pressing enter instead
        input.addEventListener('keypress', (e) => submitEnterListener(e,()=> {
            console.log('btn_confirm is clicked')
            const response = input.innerText
            if (response) 
            {
                print('green', 'response:',response)
                //hide promptDialog & return email
                removeFragment('#custom-prompt', ['dialog'])
                resolve(response)//returns the response
            }
            else 
            { 
                alert('Please do not leave the field blank.'); 
                reject(); 
            }
        }))
    })
}

