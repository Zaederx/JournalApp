/**
 * The plus/add button in the main.html tag panel,
 * READs tag data and presents in the Tag Creation View.
 */
const tableId = '#add-tag-table-body'
const inputId = '#add-tag-input'
const btnInput = '#btn-add-tag'
const tagDropTableBody:HTMLTableElement = document.querySelector(tableId) as HTMLTableElement;
const add_tag_input:HTMLElement|null = document.querySelector(inputId)
const add_tag:HTMLButtonElement = document.querySelector(btnInput) as HTMLButtonElement
const newTagDiv = document.querySelector('#new-entry-tags') as HTMLDivElement


 tagDropTableBody ? console.log(tableId,'present') : console.log(tableId,'null')

 add_tag_input ? add_tag_input.onkeyup = () => filterTable(tagDropTableBody) : console.log(inputId,'null');
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
     var html = '<div>'+tagName+'</div>'
     return html
 }

 /**
  * 
  */
 function addAllHighlightedTags() {
    console.log('*** addAllHighlightedTags function called ***')
    var rows = tagDropTableBody?.querySelectorAll('tr');
    var htmlTags:string = ''
    rows.forEach( row => {
        console.log('row,style.backgroundColor',row.style.backgroundColor)
        if (row.style.backgroundColor == clicked){
            console.log('row.cell[0]:',row.cells[0])
            htmlTags += tagRowToHTML(row)
        }
    })
    console.log('htmlTags:',htmlTags)
    newTagDiv.innerHTML =  htmlTags
 }


 