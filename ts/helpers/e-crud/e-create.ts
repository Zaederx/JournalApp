import * as fs from 'fs';
import * as eDate from '../dateStr';

export function createEvent(event:any,entryJson:string) {
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

