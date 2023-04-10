/**
 * Loads the dialog box for password authentication.
 */
export async function loadLoginDialog()
{
    console.log('loading authentication dialog...')
    //load password dialog - fetching it from files
    const authDialog = await (await fetch('./fragments/authentication-dialog.html')).text()
    console.log('authDialog:'+authDialog)
    document.querySelector('#auth-dialog')!.outerHTML = authDialog
}

/**
 * Loads the dailog box for entering the reset code
 */
export async function loadResetCodeDialog()
{
    //load password dialog - fetching it from files
    const emailPasswordDialog = await (await fetch('./fragments/reset-code-dialog.html')).text()
    document.querySelector('#password-dialog')!.outerHTML = emailPasswordDialog
}

export async function loadEmailPasswordDialog()
{
    //load password dialog - fetching it from files
    const emailPasswordDialog = await (await fetch('./fragments/password-dialog.html')).text()
    document.querySelector('#password-dialog')!.outerHTML = emailPasswordDialog
}

export async function loadCustomPrompt()
{
    //load password dialog - fetching it from files
    const customPrompt = await (await fetch('./fragments/custom-prompt.html')).text()
    document.querySelector('#custom-prompt')!.outerHTML = customPrompt
}