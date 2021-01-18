import * as fs from 'fs';
import * as eDate from '../dateStr';
/**
 * Writes a entry's json to the file system.
 * @param event IpcMainEvent
 * @param entryJson json String of entry details
 */
export function createEvent(event:Electron.IpcMainEvent, entryJson:string) {
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
  }

