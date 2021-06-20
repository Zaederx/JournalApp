/**
 * The plus/add button in the main.html tag panel,
 * READs tag data and presents in the Tag Creation View.
 */
const tableId = '#add-tag-table-body'
const inputId = '#tag-input'
const btnInput = '#btn-add-tag'
const tagDropTableBody:HTMLTableElement = document.querySelector(tableId) as HTMLTableElement;
const add_tag_input:HTMLInputElement|null = document.querySelector(inputId)
const add_tag:HTMLButtonElement = document.querySelector(btnInput) as HTMLButtonElement
const newTagDiv = document.querySelector('#new-entry-tags') as HTMLDivElement


 tagDropTableBody ? console.log(tableId,'present') : console.log(tableId,'null')

 add_tag_input ? add_tag_input.onkeyup = () => filterTable(tagDropTableBody,add_tag_input) : console.log(inputId,'null');
 //TODO Add a succesful message/alert box adding a new tag
 add_tag ? add_tag.onclick = addAllHighlightedTags : console.log('button add_tag:',btnInput,'is null')
 newTagDiv ? console.log('newTagDiv present') : console.log('newTagDiv null')
 
 /**
  * Gets tag name from html table row's first cell
  * @param row The row you want the tag name from
  * @returns html -> '<div>'+tagName+'</div>'
  */
 function tagRowToHTML(row:HTMLTableRowElement) {
     var tagName = row.cells[0].innerHTML
     var html = '<span>'+tagName+'</span>'
     return html
 }

 /**
  * The tags needed by create.ts - 'submit' function
  * and by update.ts functions
  */
 var tags = ''
 /**
  * Adds all tags selected (highlighted in the searchable tag table)
  * to the onscreen entry (in new entry / edit view)
  */
 function addAllHighlightedTags() {
    console.log('*** addAllHighlightedTags function called ***')
    var rows = tagDropTableBody?.querySelectorAll('tr');
    var htmlTags:string = ''
    var count = 0
    rows.forEach( row => {
        console.log('row,style.backgroundColor',row.style.backgroundColor)
        if (row.style.backgroundColor == clicked) {
            
            console.log('row.cell[0]:',row.cells[0])
            htmlTags += tagRowToHTML(row)
            if (count == 0) {
                tags = row.cells[0].innerHTML
            }
            else {
                tags += ','+row.cells[0].innerHTML
            }
            count++
        }
    })
    console.log('htmlTags:',htmlTags)
    console.log('tags',tags)
    newTagDiv.innerHTML =  htmlTags
 }



 