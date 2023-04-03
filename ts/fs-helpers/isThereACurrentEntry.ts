import * as fs from "fs";
import * as dirs from '../directory'
/**
 * Checks whether there is a current entry.
 * 
 */
export default async function isThereACurrentEntry()
{

    try {
        //get array of filenames from directory (there should only be one)
        var arr = await fs.promises.readdir(dirs.currentEntryDir)
        var currentEntryName = arr[0]//the previous current entry - if there is one
        if (currentEntryName != undefined)
        {
            return {entryExists:true, currentEntryName}
        }
        else {
            throw new Error('Problem reading "current-entry" directory:No current entry in "current-entry" folder (resulting in currentEntryName being undefined).')
        }
    } catch (error) {
        console.log(error)
        return {entryExists:false, currentEntryName:'undefined'}
    }
  
}