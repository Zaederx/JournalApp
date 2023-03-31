import * as fs from 'fs';
import * as dir from '../../directory';
import paths from 'path'
import Entry from '../../classes/entry'

/**
 * Functions used by main to delete Entries.
 * @param event 
 * @param filename 
 */
export async function deleteEntry(filename:string) {
    var message
    try {
        var entry = await retrieveEntry(filename)
        if (typeof entry === 'string') {
            message = 'Error retrieving entry'
            throw new Error('e-delete.js:retieveEntry function failed within deleteEntry function')
        }
        else
        {
            //delete symlinks
            deleteSymlinks(entry,filename)
            message = 'Successfully deleted entry'
        }
    }
    catch (error) 
    {
        console.log('e-delete.js:Error deleting file:'+error);
        message = 'Error deleting file:'+filename;
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
    //@ts-ignore
    entry.tags.forEach(
        //@ts-ignore
        (tag) => {
            if (tag != '') {
                console.log('deleting entry file from tag folder:',tag)
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
async function retrieveEntry(entryName:string):Promise<Entry|string> {
    console.log('*** retrieveEntry called ***')
    var entry:Entry
    try
    {
        var path = paths.join(dir.allEntries,entryName)
        //note utf-8 means -> string. if not specified return Promise<Buffer>
        var entryJson = await fs.promises.readFile(path,'utf-8') 
        entry = JSON.parse(entryJson) as Entry
        return entry
    }
    catch(error)
    {
        console.log('e-delete: Problem retrieving entry:'+error)
    }
    return 'Problem retrieving entry'
}