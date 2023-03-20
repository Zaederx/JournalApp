import * as tRead from '../tag/crud/t-read'
import * as eRead from '../entry/crud/e-read'
import * as dir from '../directory'
/**
 * Reads all tags from `tagDirs` (the tag directory of the app).
 * Reads all entries from the `all` tag directory.
 * This is for the frontend to have a list of html tags and entries.
 * @param event 
 */
export default async function prepareTagsAndEntries() {
    //Read all tag directory folder names
    var tagDirectoryNames = await tRead.readAllTags();
    console.log('tagDirectoryNames:',tagDirectoryNames)
    //Put tags folder names into 'div' tags
    var tagsHTML = tRead.directoryFoldersToHTML(tagDirectoryNames);
    console.log('tagsHTML',tagsHTML)

    //Read entry names from 'tagDir/all'
    var entryDates = await eRead.readDirFilesEntryDate(dir.allEntries)
    //Read entry names from 'tagDir/'
    var entriesHTML = eRead.entryDateToHtml(entryDates)
    
    return {tagsHTML, entriesHTML}
}