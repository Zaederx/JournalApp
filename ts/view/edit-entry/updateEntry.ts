import { ipcRenderer } from "electron";
import tagsToArr from "./tags-to-array";

/**
 * Updates the current entry
 * (instead of saving separate copy)
 * @param tags tags div
 * @param messageDiv div that displays messages
 */
export default async function updateEntry(tags:HTMLDivElement, messageDiv:HTMLDivElement) {
    console.log('function updateEntry called')
    //get entry tags from html tags div
    var tagsArr = tagsToArr(tags)
    //create and entry with updated title, boy and tags[]
    //@ts-ignore
    var entry = new Entry({title:title.innerHTML,body:body.innerHTML, tags:tagsArr})
    //turn entry to json format - ready for sending via ipcRenderer - can't send complex objects
    var entry_json = JSON.stringify(entry);
    console.info('updateEntry - entry_json: ' + entry_json);
    //get current entry name
    var entryName = await ipcRenderer.invoke('get-current-entry-name')
    //send entry_json and entryName to main to be updated
    var message = await ipcRenderer.invoke('update-entry', entry_json, entryName)
    //display message
    messageDiv.innerText = message
}