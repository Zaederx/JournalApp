import * as fs from 'fs';
import * as dir from '../../directory'
import paths from 'path'

function dateStr():string {
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var hour = date.getHours();
  var mins = date.getMinutes();
  var secs = date.getSeconds();

  var str = day + '-' + (month+1) + '-' + year + '-' + hour + '-' + mins + '-' + secs;

  return str;
}
/**
 * Writes a entry's json to the file system.
 * @param event IpcMainEvent
 * @param entryJson json String of entry details
 */
export async function createEntry(entryJson:string, directory:string=dir.allEntries):Promise<string> {
  console.log('ipcMain: Creating new Entry -' + entryJson);
  
  
  //create filename
  var fileName:string =  dateStr() + ".json";

  //if directory doesn't exist - create directory
  if (!fs.existsSync(dir.tagDirectory)) {
    fs.promises.mkdir(dir.tagDirectory)
  }

  //store entry_json in directory
  var filepath = paths.join(dir.allEntries,fileName)
  console.warn('createEntry path:', filepath)
  var message
  try {
    await fs.promises.writeFile(filepath,entryJson, 'utf-8')
    message ='File saved successfully'
  } catch (err) {
    message = 'An error occured in saving the new entry:'+err
  }
  //create symlinks at related tag directories
  symlinkEntryFile(entryJson,fileName)

  return message
}

/**
 * 
 * @param entryJson json string
 * @param filename filename
 */
export async function symlinkEntryFile(entryJson:string,filename:string) {
  console.log('*** symlinkEntryFile called ***')
  var entry = JSON.parse(entryJson)
  //all entries go into the all directory and then are
  //symlinked into other directories (tags)
  var targetFilepath = paths.join(dir.allEntries,filename)
  
  //for each tag
  entry.tags.forEach(async (tag: string)=> {
    //if tag is not emptystring or all tag
    if (tag != '' && tag != 'all'){
      //create the symlinkPath
      var symlinkPath = paths.join(dir.tagDirectory,tag,filename)
      console.log('symlinkPath',symlinkPath)
      //create a symlink using targetFilepath and symlinkPath
      var error = await fs.promises.symlink(targetFilepath,symlinkPath)
      console.log(error)
    }
  })
}

