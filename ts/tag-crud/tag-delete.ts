
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
    displayManageTagView()
}

//TODO reload that table