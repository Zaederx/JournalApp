import fs from 'fs'
import * as dirs from '../directory'
import { printFormatted } from 'printformatted-js';
import isThereAFile from '../fs-helpers/isThereAFile.js';
/**
 * Make email-verified.txt with value true
 * @param verified 
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
            var verified:'true'|'false' = fs.promises.readFile(dirs.emailVerifiedTxt).toString() as 'true'|'false'
            if (verified == 'true') { return true; }
            else if (verified == 'false') { return false }
            else { 
                throw new Error('email-verified.txt contains unknown value:'+verified)
            }
        }
    }
    catch (error:any) {
        printFormatted('red', error.message)
        setEmailVerifiedTxt('false')
        //do you want to ask user to re-verify email in this case?
        printFormatted('yellow','Please re-verify email.')//TODO put this in a frontend popup
        return false
    }
    //if all that fails - return false
    return false
}