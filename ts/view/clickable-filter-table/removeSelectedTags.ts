import { ipcRenderer } from "electron"
import getSelectedTags from "./getSelectedTags"
import displayCurrentEntry from "../display/displayCurrentEntry"

/**
 * 
 * @param tagTableBody table body of the div you would like to remove tags from
 * @param messageDiv div for alert messages
 */
export default async function removeSelectedTags(tagTableBody:HTMLTableElement, title:HTMLDivElement, body:HTMLDivElement, tags:HTMLDivElement) {
    console.log('function removeSelectedTags called')
    var selectedTags:string[] = getSelectedTags(tagTableBody)
    //get current entry
    var entryJson = await ipcRenderer.invoke('get-current-entry')
    //@ts-ignore
    var entry:Entry = JSON.parse(entryJson)
    //for each tag - remove if in list
    var tagToRemove = new Set(selectedTags)
    var i = 0
    var tempTags:string[] = [] 
    tempTags = entry.tags.slice()
    tempTags.forEach (tag => {
        console.log('iteration:',i)
        console.log('tag:',tag)
        //if tag is in set of tags to remove - then remove 
        //...(unless tag is 'all' - every entry is part of all)
        tagToRemove.has(tag) && tag != 'all' ? entry.tags.splice(i,1) : i++
        console.log('tagToRemove:',tagToRemove.has(tag))
    })
    //persist changes
    var newEntryJson = JSON.stringify(entry)
    console.log('newEntryJson:',newEntryJson)
    var promise = ipcRenderer.invoke('update-current-entry',newEntryJson)
    promise.then(async (message) => {
        //remove old entry symlinks from tag folders
        var message2 = await ipcRenderer.invoke('remove-entry-tags',selectedTags)
        //display message
        alert(message2)
    })
    .catch((err) => console.log(err))
    .then(() => {
        //page refresh
        displayCurrentEntry(title, body, tags)
    })
    .catch(err => {console.log(err)})
    
}