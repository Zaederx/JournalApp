import fs from 'fs'
import * as dirs from '../directory'
import { printFormatted } from 'ts/other/printFormatted';
import isThereAFile from 'ts/fs-helpers/isThereAFile';
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
export async function getEmailVerifiedTxt():Promise<boolean> {
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
        
    }
    //if all that fails - return false
    return false
}