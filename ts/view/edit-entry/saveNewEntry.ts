import { ipcRenderer } from "electron"
import tagsToArr from "./tags-to-array"
import Entry from "../../classes/entry"
/**
 * Saves a completely new copy of the entry
 * instead of overwriting the first copy
 */
export default async function saveNewEntry(title:HTMLDivElement, body:HTMLDivElement,tags:HTMLDivElement, messageDiv:HTMLDivElement) {
    console.log('function saveNewEntry called')
    //get entry tags from html tags div
    var tagsArr = tagsToArr(tags)
    //create and entry with updated title, boy and tags[]

    var entry = new Entry({title:title.innerHTML, body:body.innerHTML, tags:tagsArr})
    console.info('entryToJsonStr():'+entry.entryToJsonStr())
    //send to main to be persisted
    var message = await ipcRenderer.invoke('create-entry', entry.entryToJsonStr())
    //display message
    alert(message)
}