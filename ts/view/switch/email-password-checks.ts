import { ipcRenderer } from 'electron'
/**
 * Checks whether the email is verified.
 * This is the frontend version of this function.
 * There is a backend version of this function which
 * checks the `email-verified.json` file directly.
 * @returns boolean 
 */
export async function emailIsVerified(email:string):Promise<boolean> {
    const emailIsVerified = await ipcRenderer.invoke('email-is-verified', email) as boolean
    //TODO -Implmenet email-is-verfied ipcMain handler
    return emailIsVerified
}