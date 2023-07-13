import * as fs from 'fs'
/**
 * Checks whether the current entry directory exists.
 * @return true or false
 */
export async function isThereAFile(filepath:string)
{
  var isThere = false
  try 
  {
    var stat = await fs.promises.stat(filepath)
    return stat.isFile() 
  } catch (error) {
    console.log(error)
    return isThere//false
  }

  
}

/**
 * Checks whether the current entry directory exists.
 * Does not count symbolic links
 * @return true or false
 */
export async function isThereAFileStrict(filepath:string)
{
  var isThere = false
  try 
  {
    var stat = await fs.promises.stat(filepath)
    return stat.isFile() && !stat.isSymbolicLink()
  } catch (error) {
    console.log(error)
    return isThere//false
  }

  
}

