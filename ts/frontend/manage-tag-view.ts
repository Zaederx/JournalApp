const manage_tag_table_input = document.querySelector('#manage-tag-input') as HTMLInputElement

const manage_tag_view_table_body = document.querySelector('#manage-tag-table-body') as HTMLTableElement
//@ts-ignore
manage_tag_table_input ? manage_tag_table_input.onkeyup = () => filterTable(manage_tag_view_table_body, manage_tag_table_input) : console.log('manage_tag_view_table_body is null')

/**
  * Adds all tags selected (highlighted in the searchable tag table)
  * to the onscreen entry (in new entry / edit view)
  */
 function getAllHighlightedTags():string[] {
    console.log('*** addAllHighlightedTags function called ***')
    var rows = manage_tag_view_table_body?.querySelectorAll('tr');

    var tags:string[] = ['all']
    var count = 0

    //for each row...
    rows.forEach( row => {
        console.log('row.style.backgroundColor',row.style.backgroundColor)
        //if clicked...
        if (row.style.backgroundColor == clicked) {
            tags.push(row.cells[0].innerHTML)
        }
    })
    console.log('tags',tags)
    return tags
 }

 const btn_tagDelete = document.querySelector('#manage-delete-btn') as HTMLDivElement
 btn_tagDelete ? btn_tagDelete.onclick = () => deleteTags() : console.log('btn_tagDelete is null')

 function deleteTags() {
     var tags = getAllHighlightedTags()
     var message = window.tagCRUD.deleteTags(tags)
     console.log('Delete Tags function:',message)
     refresh()//refresh entry side panel
     loadTagTable(manage_tag_view_table_body) //update table
     displayManageTagView() // refresh/repaint manage tag view
 }