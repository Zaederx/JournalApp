import getSelectedTags from "./getSelectedTags"
import Entry from '../../classes/entry'
import { ipcRenderer } from "electron"

/**
 * 
 * @param entryTemp selected Entry stored temporarily in a variable
 * @param messageDiv the div that alert messages and input to
 * @param entry_tags the div holing the tags belonging the entry 
 * @param tagTableBody table body to get selected tags from
 */
export default async function addSelectedTagsToEntry(entry_tags:HTMLDivElement, tagTableBody:HTMLTableElement) {
    console.log('function addSelectedTagsToEntry called')
    //get selected tags
    var selectedTags:string[] = getSelectedTags(tagTableBody)
    //create new entry Temp 
    //@ts-ignore
    var entryTempJson = await ipcRenderer.invoke('get-current-entry')
    var entryTemp = JSON.parse(entryTempJson)
    //for each tag - if not already in tags list -> add to list
    var tagSet = new Set(entryTemp.tags)
    selectedTags.forEach (tag => {
        //if has new - don't add, else add newTag to entry.tags
        tagSet.has(tag) ? null : entryTemp.tags.push(tag)
    })
    //display message
    var message = 'Tags Added'
    alert(message)
    //display tags
    var e = new Entry()//for access to class methods (not avaiable to converted JSON to Entry)
    var tagsHTML  = e.tagsToHTML(entryTemp.tags)
    console.log('tagHTML:',tagsHTML)
    entry_tags.innerHTML = tagsHTML
}
