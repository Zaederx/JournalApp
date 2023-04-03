import { ipcRenderer } from "electron";
import tagsToArr from "./tags-to-array";
import Entry from "../../classes/entry";
import dateStr from "../../entry/crud/dateStr";

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
    //get current entry json
    var entryJson = await ipcRenderer.invoke('get-current-entry')
    //parse to an entry object
    var entry = JSON.parse(entryJson) as Entry
    //updated title, body and tags[]
    entry.title = title.innerText
    entry.body = body.innerText
    entry.tags = tagsArr
    entry.udate = dateStr()//update the edit/update date
    //turn entry to json format - ready for sending via ipcRenderer - can't send complex objects
    var entry_json = JSON.stringify(entry);
    console.info('c%updateEntry - entry_json: ' + entry_json, 'color:green');
    // //get current entry name
    
    //send entry_json and entryName to main to be updated
    var message = await ipcRenderer.invoke('update-current-entry', entry_json)
    //display message
    alert(message)
}