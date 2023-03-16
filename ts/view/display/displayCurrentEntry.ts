//display entry
import { ipcRenderer } from "electron"

/**
 * displays current entry
 */
export default async function displayCurrentEntry(title:HTMLDivElement, body:HTMLDivElement, tags:HTMLDivElement) {
    console.log('function displayCurrentEntry called')
    //get current entryJson
    var entryJson:string = await ipcRenderer.invoke('get-current-entry')
    // parse JSON to an Entry
    //@ts-ignore
    var entry:Entry = JSON.parse(entryJson)
    //@ts-ignore
    var e = new Entry({})
    // put entry details into html frontend
    title.innerHTML = entry.title
    body.innerHTML = entry.body
    tags.innerHTML = e.tagsToHTML(entry.tags)
}