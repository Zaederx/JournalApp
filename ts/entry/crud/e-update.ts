import paths from 'path'
import * as fs from 'fs';
import * as eCreate from './e-create'
import * as dirs from '../../directory';


/**
 * Updates and entry file.
 * @param entry_json 
 * @param entry_filename 
 * @returns message - success or error message
 */
export function updateEntry(entry_json:string, entry_filename:string) {
    // filepath of entry
    var filepath:string = paths.join(dirs.allEntries, entry_filename);
    var message
    try {
        fs.promises.writeFile(filepath,entry_json,'utf-8')
        message = 'File updated successfully'
    }
    catch (error) {
        message = 'Error updating file:'+error
    }
    console.log(message)
    //symlink entry to related tags
    eCreate.symlinkEntryFile(entry_json,entry_filename)

    return message
}

