import paths from 'path'
import fs from 'fs'
import * as dirs from '../directory'
import { printFormatted } from '../other/stringFormatting'

/**
 * Creates the 'all' tag directory if it does not already exist.
 */
export default async function createAllTagDirectory()
{
  printFormatted('blue', 'function createAllTagDirectories called')
  //if directory doesn't exist - create directory
  var directory = paths.join(dirs.allEntries)
  
  if (!fs.existsSync(directory)) 
  {
    try 
    {
      await fs.promises.mkdir(directory, {recursive:true})
      printFormatted('green','Successfully created directory')
    }
    catch (error:any) 
    {
      printFormatted('red','Error creating directory:', error.message)
    }
    // console.log(app.getPath('home'))
  }
}