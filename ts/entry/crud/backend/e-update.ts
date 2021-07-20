import * as fs from 'fs';
import * as eCreate from './e-create'
// const directory = require('../directory');//TODO add directory variable - easy to change all at once in future


/**
 * Updates and entry file.
 * @param entry_json 
 * @param entry_filename 
 * @returns message - success or error message
 */
export function updateEntry(entry_json:string, entry_filename:string) {
    var filepath:string = 'tagDirs/all/' + entry_filename;
    var message
    try {
        fs.promises.writeFile(filepath,entry_json,'utf-8')
        message = 'File updated successfully'
    }
    catch (error) {
        message = 'Error updating file:'+error
    }

    console.log(message)
    eCreate.symlinkEntryFile(entry_json,entry_filename)

    return message
}

