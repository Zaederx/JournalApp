/* This file manages the delete functionality avaialbe from the 
* "Add New Tags" view. Selecting a tag from the clickable table should allow you to then selected delete once it is selected.
*/


var btn_tDelete = document.querySelector('#t-delete') as HTMLButtonElement

btn_tDelete ? btn_tDelete.onclick = () => deleteSelectedTag() : console.log('#t-delete is null')

/** get its value from tag-dropdown-searchbar.ts - makeAddTTRowClickable line 73 - when user clicks on a tag's table row*/
var selectedDropdownTag:string = '';

/**
 * Deletes tags selected - used in Add New Tags View
 */
async function deleteSelectedTag() {
    console.log('deleteSelectedTag called')
    console.log('selectedDropdownTag:',selectedDropdownTag)
    //TODO use preload function to send delete message to main
    var message = await window.tagCRUD.delete(selectedDropdownTag)
    console.log(message)
    refresh()
    loadTagTable()
}

//TODO reload that table