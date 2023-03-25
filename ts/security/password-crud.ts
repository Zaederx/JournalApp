import paths from 'path'
import * as fs from 'fs' 
import bcrypt from 'bcryptjs'
import * as dirs from '../directory'

export function hashPassword(password:string)
{
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  return hash
}

export async function functionAutheticatePassword(password:string)
{
  const hash = await retrievePasswordHash()
  if(hash)
  {
    return bcrypt.compareSync(password, hash);
  }
}


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
    //write password to path
    fs.promises.writeFile(path, password)
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