import { ipcRenderer } from "electron"
import { fillTagTable, filterTable, removeSelectedTags } from "./clickable-filter-table/table"
import { highlighted } from "./clickable-filter-table/constants"
import { clicked } from "./clickable-filter-table/constants"

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


    remove_tag_btn ? remove_tag_btn.onclick = () =>  removeTagFromTagFolders(tagTableBody2) : console.warn('remove_tag_btn is null')

    async function removeTagFromTagFolders(tagTableBody2:HTMLDivElement)
    {
        console.log('function removeTagFromTagFolders called')
        //go through list of rows
        var children = tagTableBody2.children //doesn't include whitespaces like childNodes does
        var tagsArr = []
        for(var i = 0; i < children.length; i++) 
        {
            console.log('children.length:'+children.length)
            var row = tagTableBody2.children[i] as HTMLTableRowElement
            var tag = row.cells[0].innerText
            console.log('tag:'+tag)
            //find cell that matches input and remove
            if(row.style.backgroundColor == clicked && tag != 'all')
            {
                console.log('tag to remove:'+tag)
                //add tag name to list
                tagsArr.push(row.cells[0].innerText)
                //send list to be removed from tagDirs
                var message = await ipcRenderer.invoke('delete-tags', tagsArr)

                if (message == 'Successfully deleted tags') 
                {
                    //remove from html
                    tagTableBody2.children[i].remove()
                }
                //alert the user
                alert(message)
                
            }
        }
    }
    /** Searchbar */
    var tag_searchbar = document.querySelector('#tag-searchbar') as HTMLDivElement
    tag_searchbar.oninput = () => filterTable(tagTableBody2, tag_searchbar)


    //Tag table
    fillTagTable(tagTableBody2) 
// }

//var btn_addTag = document.querySelector('#t-view') as HTMLDivElement
