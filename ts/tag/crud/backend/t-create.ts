import * as fs from 'fs';



/**
 * Creates a tag folder.
 * 
 * @param tagName name of a tag to be created
 */
function createTag(tagName:string, event?:Electron.IpcMainEvent):Promise<boolean> {
    console.log('ipcMain: Creating new Tag -'+tagName);
    var directory:string = 'tagDirs/';
    var success:boolean;
    var message:string = '';
    return new Promise<boolean>((resolve,reject) => {
        fs.mkdir(directory+tagName, {recursive: false} , (error) => {
            if (error) {
                message = 'An error occured in saving the new tag:'+ tagName;
                console.error(message);
                reject(false);
            }
            else {
                message = 'Tag saved successfully';
                console.log(message);
                resolve(true);
            }
             event?.reply(message);
        })
     
    }).catch((reject:boolean) => { return reject});
    
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
    if (tagNames != null) tagNames.forEach((tagName) => createTag(tagName) ? success(event) : failure(event,tagName));
}

/**
 * Used to respond to tag creation events.
 * Called from main class to create tags.
 * @param tagNames all the tag names to be created
 */
export function createTagsInvoke(tagNames:string[]):boolean {
    var response = true;
    //for each tag - if tag is not create - mark flag 'response' as false otherwise do nothing
    if (tagNames != null) tagNames.forEach((tagName) => createTag(tagName).then( (result) => { result == true ? response = response : response = false}));
    console.error(tagNames);//TODO REMOVE When no loger needed for debugging 
    return response;
}