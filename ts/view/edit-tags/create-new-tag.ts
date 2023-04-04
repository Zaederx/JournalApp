import { ipcRenderer } from 'electron'
import { fillTagTable } from '../clickable-filter-table/table'
/**
 * Creates a new tag
 */
export default async function createNewTag(tag_searchbar:HTMLDivElement, tagTableBody2:HTMLTableElement) 
{
    console.log('function createNewTag called')
    //get input
    var tag:string = tag_searchbar.innerText
    if (tag != null && tag != '') 
    {
        //send tag to be persisted
        var message = await ipcRenderer.invoke('create-tag', tag)
        // display message
        alert(message)
        //refresh tag table
        fillTagTable(tagTableBody2)
    }
}