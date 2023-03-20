import paths from 'path'
import * as eRead from '../../../entry/crud/e-read'
import * as dirs from '../../../directory'
import EntryDate from '../../../classes/entry-date';
// import eRead from './e-read-module'
/**
 * 
 * @param tagName 
 */
export async function readTagEntries(tagName:string) {
    //get paths
    var path = paths.join(dirs.tagDirectory,tagName)
    //get entry dates (array of entries arranged by dates)
    var entryDates:EntryDate[] = await eRead.readDirFilesEntryDate(path);
    var filesHTML = eRead.entryDateToHtml(entryDates)
    return filesHTML
}