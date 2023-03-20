import * as fs from 'fs';
/**
 * Read names of all the files in a directory.
 * Used to read all entry json files in a directory.
 * @param dir (path of) directory to be read
 */
export async function readDirFiles(dir:string) {
    console.log('ipcMain: Reading new Entry - ' + dir);
    var filenames:string[] = [];
    //get all files in the directory
    var dirFilenames:string[] = await fs.promises.readdir(dir,'utf-8')
  
    /** remove .DS_Store and other '.' files */
    dirFilenames.forEach((filename)=> {
      if (filename.charAt(0) != '.') {
        filenames.push(filename)
      }
    })
  
    return filenames
  }
  