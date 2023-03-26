import { ipcRenderer } from "electron";
import tagsToArr from "./tags-to-array";
import Entry from "../../classes/entry";

/**
 * Updates the current entry
 * (instead of saving separate copy)
 * @param tags tags div
 * @param messageDiv div that displays messages
 */
export default async function updateEntry(title:HTMLDivElement, body:HTMLDivElement, tags:HTMLDivElement) {
    console.log('function updateEntry called')
    //get entry tags from html tags div
    var tagsArr = tagsToArr(tags)
    //create and entry with updated title, boy and tags[]

    var entry = new Entry({title:title.innerHTML,body:body.innerHTML, tags:tagsArr})
    //turn entry to json format - ready for sending via ipcRenderer - can't send complex objects
    var entry_json = JSON.stringify(entry);
    console.info('updateEntry - entry_json: ' + entry_json);
    // //get current entry name
    
    //send entry_json and entryName to main to be updated
    var message = await ipcRenderer.invoke('update-current-entry', entry_json)
    //display message
    alert(message)
}