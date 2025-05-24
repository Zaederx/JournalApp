import fs from 'fs'
import * as dirs from '../directory.js'
import { printFormatted } from 'printformatted-js';
import isThereAFile from '../fs-helpers/isThereAFile.js';
import { BrowserWindow } from 'electron';

type verified = {verified:string, email:string}
/**
 *  Write to email-verified.txt and set it's text to true or false.
 * @param verified true or false - whether it the user's email
 * has been verified or not.
 */
export async function setEmailVerified(verified:'true'|'false', email:string):Promise<boolean> {
    try {
        var json:verified = {verified,email}
        var jsonStr:string = JSON.stringify(json)
        //if directory doesn't exist - create directory
        if (!fs.existsSync(dirs.verifiedFolder)) {
        fs.promises.mkdir(dirs.verifiedFolder)
        }
        await fs.promises.writeFile(dirs.emailVerified,jsonStr)
        return true
    } catch (error:any) {
        printFormatted('red', 'Problem in function setEmailVerified. JSON could not be stored:', error.message)
        return false
    }
    
}

export async function getEmailVerified():Promise<verified> {
    printFormatted('blue', 'function emailIsVerified called' )
    try {
        if (await isThereAFile(dirs.emailVerified)) {

            //@ts-ignore
            var verifiedJson:string = await fs.promises.readFile(dirs.emailVerified,{encoding:'utf-8'})
            var emailVerified:verified = JSON.parse(verifiedJson)
            return emailVerified
        }
    }
    catch (error:any) {
       printFormatted('red', 'Error reading email-verified.json:'+error.message)
       //if error occurs - return empty verified object
       var emailVerified:verified = {verified:'', email:''}
       return emailVerified
    }
    //if all else fails - return empty verified object
    var emailVerified:verified = {verified:'', email:''}
    return emailVerified
}
/**
 * Returns the text that is stored in email-verified.txt
 * This is the backend version of this function. There is a frontend 
 * version which send a message to ipcMain for email verification.
 */
export async function emailIsVerified(email:string):Promise<boolean> {
    printFormatted('blue', 'function emailIsVerified called' )
    try {
        if (await isThereAFile(dirs.emailVerified)) {

            //@ts-ignore
            var verifiedTxt:string = await fs.promises.readFile(dirs.emailVerified,{encoding:'utf-8'}) as 'true'|'false'
            var json = JSON.parse(verifiedTxt) as verified
            if (json.email == email && json.verified == 'true') { return true; }
            else if (json.verified == 'false') { return false }
            else if (json.email != email) { return false }
            else { 
                throw new Error('email-verified.json contains unknown value:'+verifiedTxt)
            }
        }
    }
    catch (error:any) {
        setEmailVerified('false', email)//because currently not true of false
        printFormatted('red', 'Error in function emailIsVerified:',error.message)
        //alert pop up on frontend - ask user to re-verify email in this case
        BrowserWindow.getFocusedWindow()?.webContents.send('alert', 'Please re-verify email.')
        return false
    }
    //if all that fails - return false
    return false
}