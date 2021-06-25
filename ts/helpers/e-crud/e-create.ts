import * as fs from 'fs';
import * as eDate from '../dateStr';
/**
 * Writes a entry's json to the file system.
 * @param event IpcMainEvent
 * @param entryJson json String of entry details
 */
export function createEntry(event:Electron.IpcMainEvent, entryJson:string) {
    console.log('ipcmain: Creating new Entry -' + entryJson);
    var directory:string = "tagDirs/all/";
    var fileName:string = eDate.dateStr() + ".json";
  
    fs.writeFile(directory+fileName, entryJson, (err) => {
    var message:string = '';
      if (err) {
        message = 'An error occured in saving the new entry.';
      }
      else {
        message = 'Entry saved succesfully';
      }
      console.log(message);
      event.reply('response-e-create', message);
    }); 

    symlinkEntryFile(entryJson,fileName)
  }

  export async function symlinkEntryFile(entryJson:string,filename:string) {
    console.log('*** symlinkEntryFile called ***')
    var entry:Entry = JSON.parse(entryJson)
    var targetFile = 'tagDirs/all/'+filename
    
    entry.tags.forEach(async (tag)=> {
      if (tag != '' && tag != 'all'){
        var symlinkPath = 'tagDirs/'+tag+'/'+filename
        console.log('symlinkPath',symlinkPath)
        var error = await fs.promises.symlink(targetFile,symlinkPath)
        console.log(error)
      }
    })
  }

