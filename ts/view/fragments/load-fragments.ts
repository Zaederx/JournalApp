import { pasteWithoutStyle } from '../input-helpers/key-capture'


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
    resetCodeDialog.style.display = 'grid'
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
    document.querySelector('#custom-prompt') as HTMLDivElement
    var customPrompt = document.querySelector('#custom-prompt') as HTMLDivElement
    customPrompt.outerHTML = customPromptHTML
    
    return customPrompt
}