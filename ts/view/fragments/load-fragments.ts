function pasteWithoutStyle(e:any)
{
    console.warn('function pasteWithoutStyle called')
    console.log('typeof e:',typeof e)
    e.preventDefault()
    if (e.clipboardData && e.clipboardData.getData) {
        e.target.textContent = e.clipboardData.getData('text/plain')
    }
}

// /**
//  * Loads the dialog box for password authentication.
//  */
// export async function loadLoginDialog()
// {
//     console.log('loading authentication dialog...')
//     //load password dialog - fetching it from files
//     const authDialog = await (await fetch('./fragments/authentication-dialog.html')).text()
//     console.log('authDialog:'+authDialog)
//     document.querySelector('#auth-dialog')!.outerHTML = authDialog
//     document.querySelector('.editable')?.addEventListener('paste', pasteWithoutStyle)
// }

/**
 * Loads the dailog box for entering the reset code
 */
export async function loadResetCodeDialog()
{
    //load password dialog - fetching it from files
    const resetCodeDialogHTML = await (await fetch('./fragments/reset-code-dialog.html')).text()

    const resetCodeDialog = document.querySelector('#reset-code-dialog') as HTMLDivElement
    resetCodeDialog!.outerHTML = resetCodeDialogHTML
    resetCodeDialog.style.display = 'grid'
    //set each editable div to not paste the style of what is copy pasted
    resetCodeDialog.querySelectorAll('.editable').forEach((div) => {
        div?.addEventListener('paste', pasteWithoutStyle)
    })
}

export async function loadEmailPasswordDialog()
{
    //load password dialog - fetching it from files
    const emailPasswordDialog = await (await fetch('./fragments/email-password-dialog.html')).text()
    document.querySelector('#email-password-dialog')!.outerHTML = emailPasswordDialog
    document.querySelector('.editable')?.addEventListener('paste', pasteWithoutStyle)
}

export async function loadCustomPrompt()
{
    //load password dialog - fetching it from files
    const customPrompt = await (await fetch('./fragments/custom-prompt.html')).text()
    document.querySelector('#custom-prompt')!.outerHTML = customPrompt
    document.querySelector('.editable')?.addEventListener('paste', pasteWithoutStyle)
}