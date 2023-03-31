import paths from 'path'
import * as fs from 'fs' 
import bcrypt from 'bcryptjs'
import * as dirs from '../directory'

/**
 * Hashes password
 * @param password password to be hashed
 */
export function hashPassword(password:string)
{
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  return hash
}

/**
 * Authenticates password against stored password hash
 * @param password password to be authenticated against stored password hash
 */
export async function functionAutheticatePassword(password:string)
{
  const hash = await retrievePasswordHash()
  if(hash)
  {
    return bcrypt.compareSync(password, hash);
  }
}

/**
 * Retrieve password hash from a stored file.
 */
export async function retrievePasswordHash()
{
  try {
   const passwordHash = await fs.promises.readFile(dirs.passwordHash, 'utf-8')
   return passwordHash
  } catch (error) {
    console.log(error)
  }
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
 * @param password password to be store
 */
export function storePasswordHash(dir:string,password:string)
{
  try {
    //create path
    var path = paths.join(dir,'password.txt')
    //make folder (in case it's not already there)
    fs.promises.mkdir(dirs.secureFolder)
    //write password to path
    fs.promises.writeFile(path, password)
    return 'Password stored successfully'
  } catch (error) {
    console.log(error)
  }
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