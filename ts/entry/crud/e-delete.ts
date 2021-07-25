import * as fs from 'fs';
import * as dir from '../../directory';
import paths from 'path'

/**
 * Functions used by main to delete Entries.
 * @param event 
 * @param filename 
 */
export async function deleteEntry(filename:string) {
    var message
    try {
        var entry = await retrieveEntry(filename)
        deleteSymlinks(entry,filename)
        message = 'Successfully deleted entry'
    }
    catch (error) {
        console.log('Error deleting file:'+error);
        message = 'Error deleting file:'+filename;
        console.log('e-delete.js:file - filename:',filename);
    }
    return message
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
            if (tag != '') {
                console.log('tagname:',tag)
                try {
                    var path =  paths.join(dir.tagDirectory,tag,filename)
                    fs.promises.unlink(path)
                }
                catch (error) {
                    console.log(error)
                }
            }
        })
}
/**
 * Gets the entry associated with the name given
 */
async function retrieveEntry(entryName:string):Promise<Entry> {
    console.log('*** retrieveEntry called ***')
    var path = paths.join(dir.allEntries,entryName)
    //note utf-8 means -> string. if not specified return Promise<Buffer>
    var entryJson = await fs.promises.readFile(path,'utf-8') 

    var entry:Entry = JSON.parse(entryJson) as Entry
    return entry
}