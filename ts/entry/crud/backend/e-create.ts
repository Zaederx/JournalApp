import * as fs from 'fs';
import * as eDate from './dateStr';
import * as dir from '../../../directory'

/**
 * Writes a entry's json to the file system.
 * @param event IpcMainEvent
 * @param entryJson json String of entry details
 */
export async function createEntry(entryJson:string) {
  console.log('ipcmain: Creating new Entry -' + entryJson);
  var fileName:string = eDate.dateStr() + ".json";
  var path = dir.allEntries+fileName
  var message
  try {
    await fs.promises.writeFile(path,entryJson, 'utf-8')
    message ='File saved successfully'
  } catch (err) {
    message = 'An error occured in saving the new entry:'+err
  }
  symlinkEntryFile(entryJson,fileName)

  return message
}

export async function symlinkEntryFile(entryJson:string,filename:string) {
  console.log('*** symlinkEntryFile called ***')
  var entry:Entry = JSON.parse(entryJson)
  var targetFile = dir.allEntries+filename
  
  entry.tags.forEach(async (tag)=> {
    if (tag != '' && tag != 'all'){
      var symlinkPath = dir.tagDirectory+tag+'/'+filename
      console.log('symlinkPath',symlinkPath)
      var error = await fs.promises.symlink(targetFile,symlinkPath)
      console.log(error)
    }
  })
}

