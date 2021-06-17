import * as fs from 'fs';
import * as eCreate from '../e-crud/e-create'
const directory = require('../directory');



export function updateEntry(event:Electron.IpcMainEvent, entryJson:string, filename:string) {
    var filepath:string = directory.all + filename;
    fs.writeFile(filepath, entryJson, function(err) {
        if (err) {
            var message = 'updateEntry(): Error in updating entry file: '+err;
            console.log(message);
            event.reply('response-e-update', message);
        }
        else {
            var message = 'updateEntry(): File Updated Successfully';
            console.log(message);
            event.reply('response-e-update', message);
        }
    })

    eCreate.symlinkEntryFile(entryJson,filename)
}

