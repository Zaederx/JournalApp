import * as fs from 'fs'
/**
 * Checks whether the current entry directory exists.
 * @return true or false
 */
export default async function isThereAFile(filepath:string)
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