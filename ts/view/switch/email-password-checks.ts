import { ipcRenderer } from 'electron'
/**
 * Checks whether the email is verified.
 * @returns boolean 
 */
export async function emailIsVerified():Promise<boolean> {
    const emailIsVerified = await ipcRenderer.invoke('email-is-verified') as boolean
    //TODO -Implmenet email-is-verfied ipcMain handler
    return emailIsVerified
}