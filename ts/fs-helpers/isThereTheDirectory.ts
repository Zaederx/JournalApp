import * as fs from 'fs'
/**
 * Checks whether the current entry directory exists.
 * @return true or false
 */
export default async function isThereADirectory(dir:string)
{
  var isThere = false
  try 
  {
    var stat = await fs.promises.stat(dir)
    return stat.isDirectory()
  } catch (error) {
    console.log(error)
    return isThere//false
  }

  
}