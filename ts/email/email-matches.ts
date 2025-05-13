import { printFormatted } from '../other/printFormatted'
import fs from 'fs'
import * as dirs from '../directory'
import brcrypt from 'bcryptjs'

/**
 * Checks whether an email matches the stored email hash of the user.
 * @param email the email of the user to be checked against the hash
 * @returns boolean - true if email matches stored hash
 */
export async function emailMatchesStoredHash(email:string):Promise<boolean>{
    var emailHash = await fs.promises.readFile(dirs.emailHash,{encoding:'utf-8'})
    var matches = await brcrypt.compare(email,emailHash)
    return matches
}