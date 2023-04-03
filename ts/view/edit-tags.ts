import { ipcRenderer } from "electron"
import { fillTagTable, filterTable, removeSelectedTags } from "./clickable-filter-table/table"

/**
 * Creates a new tag
 */
async function createNewTag(tag_searchbar:HTMLDivElement, tagTableBody2:HTMLTableElement) 
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
//IMPORTANT - BECAUSE i'M USING DEFER ON SCRIPTS - DON'T USE WINDOW ONLOAD - CAUSES PROBLEMS
// window.onload = () => { 
    var tagTableBody2 = document.querySelector('#tag-table-body') as HTMLTableElement
    var tag_searchbar = document.querySelector('#tag-searchbar')  as HTMLDivElement

    const title = document.querySelector('#entry-title') as HTMLDivElement
    const body = document.querySelector('#entry-body') as HTMLDivElement
    const tags = document.querySelector('#entry-tags') as HTMLDivElement
    /** Buttons */ 
    var add_tag_btn = document.querySelector('#add-new-tag') as HTMLDivElement
    var remove_tag_btn = document.querySelector('#remove-selected-tags') as HTMLDivElement
    add_tag_btn ? add_tag_btn.onclick = () => createNewTag(tag_searchbar,tagTableBody2) : console.warn('add_tag_btn is null')


    remove_tag_btn ? remove_tag_btn.onclick = () => removeSelectedTags(tagTableBody2,title,body,tags) : console.warn('remove_tag_btn is null')

    /** Searchbar */
    var tag_searchbar = document.querySelector('#tag-searchbar') as HTMLDivElement
    tag_searchbar.oninput = () => filterTable(tagTableBody2, tag_searchbar)


    //Tag table
    fillTagTable(tagTableBody2) 
// }

//var btn_addTag = document.querySelector('#t-view') as HTMLDivElement
