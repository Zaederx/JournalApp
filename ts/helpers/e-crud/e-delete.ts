import * as fs from 'fs';
import * as directory from '../directory';

/**
 * Functions used by main to delete Entries.
 * @param event 
 * @param filename 
 */
export function deleteEntry(event:Electron.IpcMainEvent, filename:string) {
    
    var path:fs.PathLike = directory.all + filename;
    console.log('e-delete.js:file path:'+path);
    var callback:fs.NoParamCallback = function (error:NodeJS.ErrnoException|null) {
        if (error) {
            console.log('Error deleting file:'+error);
            var channel:string = 'response-e-delete';
            var message:string = 'Error deleting file:'+filename;
            event.reply(channel, message);
            // throw error;
        }
    };
    fs.unlink(path, callback);
}