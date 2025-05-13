import paths from 'path'
import * as fs from 'fs' 
import bcrypt from 'bcryptjs'
import * as dirs from '../directory'
import { printFormatted } from '../other/printFormatted';
import isThereTheDirectory from '../fs-helpers/isThereTheDirectory';

/**
 * Hashes password
 * @param str password to be hashed
 * @return a hashed string
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
 * @returns boolean - whether the file was stored successfully. True if successful.
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
    //return whether the file was stored
    return response = true
  } catch (error:any) {
    printFormatted('red', error.message)
  }
  return response
}

/**
 * Stores the email verification code hash.
 * @param codeHash email verification code hash to be stored
 * @returns boolean - whether code was stored successfully
 */
export async function storeVerificationCodeHash(codeHash:string)
{
  return store(dirs.verificationCodeHash, codeHash)
}

/**
 * 
 * @param codeHash the reset code hash
 * @returns boolean - whether code was stored successfully
 */
export async function storeResetCodeHash(codeHash:string)
{
  return store(dirs.resetCodeHash, codeHash)
}

/**
 * Stores the hashed email in a given directory.
 * @param dir directory to store the hash in
 * @param emailHash the email to be stored that has already been hashed
 * @returns boolean - whether the email was stored successfully. True if successful.
 */
export async function storeEmailHash(emailHash:string)
{
  return store(dirs.emailHash, emailHash)
}

/**
 * Stores password hash.
 * @param passwordHash password to be store
 * @returns boolean - whether the email was stored succesfully. True if successful.
 */
export function storePasswordHash(passwordHash:string)
{
  return store(dirs.passwordHash, passwordHash)
}

/**
 * Function fo retrieving file contents.
 * @param filepath filepath of the file you wish to get contents from.
 * @returns Promise<string> (file contents) or Promise<undefined>
 */
async function retrieve(filepath:string):Promise<string|undefined>
{
  try {
    const file_contents = await fs.promises.readFile(filepath, 'utf-8')
    return file_contents
   } catch (error:any) {
     printFormatted('red', error.message)
     return undefined
   }
}
/**
 * Retrieves reset code hash from a stored file.
 * @returns Promise<string> (reset code hash) or Promise<undefined>
 */
export async function retrieveResetCodeHash()
{
  return retrieve(dirs.resetCodeHash)
}


/**
 * Retrieve reset code hash from a stored file.
 * @returns Promise<string> (verification code hash) or Promise<undefined>
 */
export async function retrieveEmailVerificationCodeHash()
{
  return retrieve(dirs.verificationCodeHash)
}

/**
 * Retrieve email hash from a stored file.
 * @returns Promise<string> (email hash) or Promise<undefined>
 */
export async function retrieveEmailHash()
{
  return retrieve(dirs.emailHash)
}

/**
 * Retrieve password hash from a stored file.
 * @returns Promise<string> (password hash) or Promise<undefined>
 */
export async function retrievePasswordHash()
{
  return retrieve(dirs.passwordHash)
}




/**
 * Authenticates verification code against stored the verification code hash
 * @param verificationCode password to be authenticated against stored password hash
 * @returns boolean - whether the verification code matches the stored verification code hash. True if successful / they match.
 */
export async function authenticateEmailVerificationCode(verificationCode:string)
{
  const hash = await retrieveEmailVerificationCodeHash()
  if(hash)
  {
    return bcrypt.compareSync(verificationCode, hash);
  }
  return false
}

/**
 * Authenticates reset code against stored the reset code hash.
 * Note: This function deals iwth the 'reset code'. 
 * Don't confuse this with authenticating email verification code.
 * @param resetCode password to be authenticated against stored password hash
 * @returns boolean - whether the reset code 
 * matches the stored reset code hash.
 * True if successful / they match.
 */
export async function authenticateResetCode(resetCode:string)
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
 * @returns boolean - whether the email
 * matches the stored email hash.
 * True if successful / they match.
 */
export async function authenticateEmail(email:string)
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
 * @returns boolean - whether the password
 * matches the password hash.
 * True if successful / they match.
 */
export async function authenticatePassword(password:string)
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
 * If the password file exists, that password has been set.
 * @returns boolean - whether the password file exists. True if exists.
 */
export async function passwordFileExists():Promise<boolean>
{
  var exists = false
  try
  {
    //gets details/info of the file
    var stats = await fs.promises.stat(dirs.passwordHash)
    //check details/info object is present & then if the file exists
    if(stats && stats.isFile())
    {
      exists = true
    }
    //return whether the file exists or not
    return exists
  }
  catch (error)
  {
    console.log(error)
  }
  return exists
}