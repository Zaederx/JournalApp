import fs from 'fs'
import * as dirs from '../directory.js'
import { printFormatted } from 'printformatted-js';
import isThereAFile from '../fs-helpers/isThereAFile.js';
import { ipcMain } from 'electron';
/**
 *  Write to email-verified.txt and set it's text to true or false.
 * @param verified true or false - whether it the user's email
 * has been verified or not.
 */
export async function setEmailVerifiedTxt(verified:'true'|'false') {
    await fs.promises.writeFile(dirs.emailVerifiedTxt,verified)
}

/**
 * Returns the text that is stored in email-verified.txt
 */
export async function emailIsVerified():Promise<boolean> {
    printFormatted('blue', 'function emailIsVerified called' )
    try {
        if (await isThereAFile(dirs.emailVerifiedTxt)) {
            var verified:'true'|'false' = await fs.promises.readFile(dirs.emailVerifiedTxt,{encoding:'utf-8'}) as 'true'|'false'
            if (verified == 'true') { return true; }
            else if (verified == 'false') { return false }
            else { 
                throw new Error('email-verified.txt contains unknown value:'+verified)
            }
        }
    }
    catch (error:any) {
        setEmailVerifiedTxt('false')//because currently not true of false
        printFormatted('red', 'Error in function emailIsVerified:',error.message)
        //alert pop up on frontend - ask user to re-verify email in this case
        ipcMain.emit('alert', 'Please re-verify email.')
        return false
    }
    //if all that fails - return false
    return false
}