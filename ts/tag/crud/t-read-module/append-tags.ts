import EntryDate from '../../../classes/entry-date';
import { readTagDir } from './read-tag-dir'


/**
 *
 * Appends all tags to the tag list (sending them to the frontend).
 * It does this one tag at a time.
 * @param directoryFolders
 */
export async function appendTags(dir:string, clearTags:boolean) 
{
    var firstTag = true
    var directory:string[] = await readTagDir(dir); clearTags
    directory.forEach((tag:string) => {
        //if not the .DS_Store file or another invisible file
        if (tag.charAt(0) != '.') {
            //if first tag - clear the tags - else don't clear tags when sending tagname
            (firstTag) ? sendSingleTag(tag, clearTags) : sendSingleTag(tag,clearTags)
            clearTags = false
            firstTag = false
        }
    });
}

  /**
   * This function is used to send a tag to the frontend.
   * 
   * @param dirName the tag name of the directory
   */
function sendSingleTag(dirName:string, clearTags:boolean)
{
    //send directory name to frontend (to be added to tags list)
    //only if ipc channel is available - send method is available
    if (process.send)
    {
        //message is sent from this (child process)
        //to the parent process
        process.send({tagDirname:dirName, clearTags:clearTags});
    }
}