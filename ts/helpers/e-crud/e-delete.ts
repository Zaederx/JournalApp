import * as fs from 'fs';
import * as directory from '../directory';

/**
 * Functions used by main to delete Entries.
 * @param event 
 * @param filename 
 */
export async function deleteEntry(event:Electron.IpcMainEvent, filename:string) {
    var entry = await retrieveEntry(filename)
    deleteSymlinks(entry,filename)
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

/**
 * Delete symlinks related to entry and filename
 * @param entry 
 */
function deleteSymlinks(entry:Entry,filename:string) {
    console.log('*** deleteSymlinks ***') 
    //delete each related symlink
    entry.tags.forEach(
        (tag) => {
            try {
                var path = 'tagDirs/'+tag+'/'+filename
                fs.promises.unlink(path)
            }
            catch (error) {
                console.log(error)
            }
        })
}
/**
 * Gets the entry associated with the name given
 */
async function retrieveEntry(entryName:string):Promise<Entry> {
    console.log('*** retrieveEntry called ***')
    var path = 'tagDirs/all/'+entryName
    //note utf-8 means -> string. if not specified return Promise<Buffer>
    var entryJson = await fs.promises.readFile(path,'utf-8') 

    var entry:Entry = JSON.parse(entryJson) as Entry
    return entry
}