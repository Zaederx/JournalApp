import paths from 'path'
import * as fs from 'fs' 
import bcrypt from 'bcryptjs'
import * as dirs from '../directory'
import { printFormatted } from '../other/stringFormatting';
import isThereTheDirectory from '../fs-helpers/isThereTheDirectory';

/**
 * Hashes password
 * @param str password to be hashed
 */
export function hash(str:string)
{
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(str, salt);
  return hash
}

/**
 * Stores the hashed email in a given directory.
 * @param filepath directory and filename to store the hash
 * @param filecontent the content to be stored in the file
 */
export async function store(filepath:string,filecontent:string)
{
  var response = false
  try {
    var exists = await isThereTheDirectory(dirs.secureFolder)
    if (!exists)
    {
      //make folder (in case it's not already there) - will do nothing if already exists
      await fs.promises.mkdir(dirs.secureFolder)
    }
    //write password to path
    await fs.promises.writeFile(filepath, filecontent)
    return response = true
  } catch (error:any) {
    printFormatted('red', error.message)
  }
  return response
}

export async function storeVerificationCode(codeHash:string)
{
  return store(dirs.verificationCodeHash, codeHash)
}

export async function storeResetCodeHash(codeHash:string)
{
  return store(dirs.resetCodeHash, codeHash)
}

/**
 * Stores the hashed email in a given directory.
 * @param dir directory to store the hash in
 * @param emailHash the email to be stored that has already been hashed
 */
export async function storeEmailHash(emailHash:string)
{
  return store(dirs.emailHash, emailHash)
}

/**
 * Stores password hash.
 * Note: directory is not the filepath.
 * i.e.
 * ```
 * directory = '/path/to/folder'
 * filepath = '/path/to/folder/file.txt'
 * ```
 * @param dir directory to store password into
 * @param passwordHash password to be store
 */
export function storePasswordHash(passwordHash:string)
{
  return store(dirs.passwordHash, passwordHash)
}

/**
 * Function fo retrieveing file contents.
 * @param filepath filepath of the file you wish to get contents from.
 */
async function retrieve(filepath:string):Promise<string|undefined>
{
  try {
    const passwordHash = await fs.promises.readFile(filepath, 'utf-8')
    return passwordHash
   } catch (error:any) {
     printFormatted('red', error.message)
     return undefined
   }
}
/**
 * Retrieve reset code hash from a stored file.
 */
export async function retrieveResetCodeHash()
{
  return retrieve(dirs.resetCodeHash)
}


/**
 * Retrieve reset code hash from a stored file.
 */
export async function retrieveVerificationCodeHash()
{
  return retrieve(dirs.verificationCodeHash)
}

/**
 * Retrieve email hash from a stored file.
 */
export async function retrieveEmailHash()
{
  return retrieve(dirs.emailHash)
}

/**
 * Retrieve password hash from a stored file.
 */
export async function retrievePasswordHash()
{
  return retrieve(dirs.passwordHash)
}




/**
 * Authenticates verification code against stored the verification code hash
 * @param verificationCode password to be authenticated against stored password hash
 */
export async function autheticateVerificationCode(verificationCode:string)
{
  const hash = await retrieveVerificationCodeHash()
  if(hash)
  {
    return bcrypt.compareSync(verificationCode, hash);
  }
  return false
}

/**
 * Authenticates reset code against stored the reset code hash
 * @param resetCode password to be authenticated against stored password hash
 */
export async function autheticateResetCode(resetCode:string)
{
  const hash = await retrieveResetCodeHash()
  if(hash)
  {
    return bcrypt.compareSync(resetCode, hash);
  }
  return false
}

/**
 * Authenticates password against stored password hash
 * @param email password to be authenticated against stored password hash
 */
export async function autheticateEmail(email:string)
{
  const hash = await retrieveEmailHash()
  if(hash)
  {
    return bcrypt.compareSync(email, hash);
  }
  return false
}

/**
 * Authenticates password against stored password hash
 * @param password password to be authenticated against stored password hash
 */
export async function autheticatePassword(password:string)
{
  const hash = await retrievePasswordHash()
  if(hash)
  {
    return bcrypt.compareSync(password, hash);
  }
  return false
}


/**
 * Checks whether the password file exists or not.
 * This determines whether or not a password is
 * requested or app opening.
 */
export async function passwordFileExists():Promise<boolean>
{
  var exists = false
  try
  {
    var stats = await fs.promises.stat(dirs.passwordHash)
    if(stats && stats.isFile())
    {
      exists = true
    }
    return exists
  }
  catch (error)
  {
    console.log(error)
  }
  return exists
}