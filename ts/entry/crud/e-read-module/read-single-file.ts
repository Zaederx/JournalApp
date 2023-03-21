import paths from 'path';
import * as fs from 'fs'
import * as dirs from '../../../directory'
/**
 * Reads a single file from a directory.
 * @param event 
 * @param filename 
 */
export async function readSingleFile(dir:string,filename:string) {
    console.log('ipcMain: Reading file - '+filename);
  
    var entry
    var entry_filepath = paths.join(dir,filename);
    var message
    try {
      entry = await fs.promises.readFile(entry_filepath,'utf-8')
      message = 'File read successfully'
      return entry
    }
    catch (error) {
      message = 'Error reading file'+error
      return message
    }
}