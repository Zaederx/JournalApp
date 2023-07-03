import * as fs from 'fs';
import * as dir from '../../directory'
import paths from 'path'
import Entry from '../../classes/entry';
import { printFormatted } from '../../other/stringFormatting';

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
  console.log('ipcMain: Creating new Entry:' + entryJson);
  
  //json string to object
  var entry:Entry = JSON.parse(entryJson);
  //create filename
  var fileName:string =  entry.cdate + ".json";

  //if directory doesn't exist - create directory
  if (!fs.existsSync(dir.tagDirectory)) {
    fs.promises.mkdir(dir.tagDirectory)
  }

  //store entry_json in directory
  var filepath = paths.join(dir.allEntries,fileName)
  console.warn('createEntry path:', filepath)
  var message
  var promise;
  try {
    promise = fs.promises.writeFile(filepath,entryJson, 'utf-8')
    message ='File saved successfully'
    //create symlinks at related tag directories
    promise.then(() => symlinkEntryJsonToTagFolders(entryJson,fileName))  
   } catch (err) {
    message = 'An error occured in saving the new entry:'+err
  }
  

  return message
}

/**
 * Symlinks an entry to it's tags.
 * Takes and entry in json format (because that's the format)
 * that can be sent through ipc messaging.
 * It's then converted back into an object within the function
 * so that the tags can be looped through for symlinking.
 * @param entryJsonStr json string
 * @param filename filename
 */
export async function symlinkEntryJsonToTagFolders(entryJsonStr:string,filename:string) {
  console.log('*** symlinkEntryFile called ***')
  console.log('entryJsonStr:',entryJsonStr)
  var entryJson = JSON.parse(entryJsonStr)
  console.log('entryJson:', entryJson)
  //@ts-ignore
  try {
    var entry = new Entry(entryJson)//to have object methods
    //all entries go into the all directory and then are
    //symlinked into other directories (tags)
    var targetFilepath = paths.join(dir.allEntries,filename)
    var successful = symlinkEntryTags(entry, filename, targetFilepath)
    if (!successful) { throw new Error('Symlinking file was unsucessful')}
  }
  catch (error)
  {
    printFormatted('red', error)
  }
  
}

/**
 * @param entry entry object
 * 
 * @param filename entry filename
 * 
 * @param targetFilepath destination of the new symlink
 */
function symlinkEntryTags(entry:Entry, filename:string, targetFilepath:string) 
{
  var successful = false
  //for each tag - put a symlink into tag folder
    //@ts-ignore
    entry.tags.forEach(async (tag: string)=> {
      //if tag is not emptystring or all tag
      if (tag != '' && tag != 'all'){
        //create the symlinkPath
        var symlinkPath = paths.join(dir.tagDirectory,tag,filename)
        console.log('symlinkPath',symlinkPath)
        //create a symlink using targetFilepath and symlinkPath
        try {
          await fs.promises.symlink(targetFilepath,symlinkPath)
          successful = true
        }
        catch (e) {
          console.log(e)
        }
      }
    })
    return successful
}