import paths from 'path';
import * as fs from 'fs'
import * as dirs from '../../../directory'
/**
 * Reads a single file from a directory.
 * @param event 
 * @param filename 
 * @return entry json contents as a string OR return an error message string
 */
export async function readSingleFile(dir:string,filename:string):Promise<string> {
  if (filename != '.DS_Store')
  {
    console.log('ipcMain: Reading file - '+filename);
  
    var entryJsonStr
    var entry_filepath = paths.join(dir,filename);
    var message
    try {
      entryJsonStr = await fs.promises.readFile(entry_filepath,'utf-8')
      message = 'File read successfully'
      return entryJsonStr
    }
    catch (error) {
      message = 'Error reading file'+error
      return message
    }
  }
  else 
  {
    return 'Ignoring .DS_Store file.'
  }
}