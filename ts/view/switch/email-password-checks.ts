import { ipcRenderer } from 'electron'
/**
 * Checks whether the email is verified.
 * @returns boolean 
 */
export async function emailIsVerified(email:string):Promise<boolean> {
    const emailIsVerified = await ipcRenderer.invoke('email-is-verified', email) as boolean
    //TODO -Implmenet email-is-verfied ipcMain handler
    return emailIsVerified
}