import * as fs from 'fs'
/**
 * Checks whether the current entry directory exists.
 * @return true or false
 */
export default async function isThereTheDirectory(dir:string)
{
  var isThere = false
  try {
    var stat = await fs.promises.stat(dir)
  } catch (error) {
    console.log(error)
    return isThere//false
  }
  isThere = true
  return isThere
  
}