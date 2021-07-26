import * as fs from 'fs';
import * as dir from '../../directory'
import paths from 'path'


/**
 * Creates a tag folder.
 * 
 * @param tagName name of a tag to be created
 */
export async function createTag(tagName:string):Promise<string> {
    console.log('ipcMain: Creating new Tag -'+tagName);
    var tagpath:string = paths.join(dir.tagDirectory,tagName);
    var success:boolean;
    var message:string = '';
    try {
        fs.promises.mkdir(tagpath)
        message = ''
    }
    catch (error) {
        message = 'Error creating tag:'+ error
    }
    return message;
}



/**
 * Handles event failure.
 * Calls `event.replay(message)` sending a failure message.
 * @param event Electron.IpcMainEvent
 * @param tagName message string
 */
function failure(event:Electron.IpcMainEvent, tagName:string) {
    event.reply('An error occured in saving the new tag:'+ tagName);
}

/**
 * Used to respond to tag creation events.
 * Called from main class to create tags.
 * @param event Electron.IpcMainEvent
 * @param tagNames all the tag names to be created
 */
export async function createTags(tagNames:string[]):Promise<string> {
    var message = '';
    if (tagNames != null) {
        try {
            tagNames.forEach((tagName) => createTag(tagName))
        }
        catch (error) {
            message = 'Error creating Tags.'
            return message //fail
        }
        message = 'Successfully created tags'
        return message;
    }
    return message //success
}
