import * as fs from 'fs';

/**
 * Creates a tag folder.
 * 
 * @param tagName name of a tag to be created
 */
function createTag(tagName:string) :boolean {
    console.log('ipcMain: Creating new Tag -'+tagName);
    var directory:string = 'tagDirs/';
    var success:boolean;
    fs.mkdir(directory+tagName, {recursive: false} , (error) => {
        var message:string = '';
        if (error) {
            message = 'An error occured in saving the new tag:'+ tagName;
            success = false;
        }
        else {
            message = 'Tag saved successfully';
            success = true;
        }
        return success;
    })
    return false;
}

/**
 * Handles event success.
 * Calls `event.reply(message)` sending a success message.
 * @param event Electron.IpcMainEvent
 */
function success(event:Electron.IpcMainEvent) {
    event.reply('Tag saved successfully');
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
export function createTags(event:Electron.IpcMainEvent, tagNames:string[]) {
    if (tagNames != null) tagNames.forEach((tagName) => createTag(tagName) == true ? success(event) : failure(event,tagName));
}