/**
 * The plus/add button in the main.html tag panel,
 * READs tag data and presents in the Tag Creation View.
 */
const btn_addTag:HTMLElement|null = document.querySelector('#t-view');
const tagTableBody:HTMLTableElement|null = document.querySelector('#tag-table-body');

//TODO Add a succesful message/alert box adding a new tag

if(btn_addTag != null)
btn_addTag.onclick = () => displayTagView();





/**
 * Fills tag table with all tags.
 */
function loadTagTable() {
    //ipcMessage - requests tag to be read
    window.CRUD.readTags(); 
    //wait for for ipc response -> load tag table
    window.tagCRUD.readAllTags((tags:string[]) => {
        tags.forEach( tag => {
            if(tagTableBody != null)
            tagTableBody.innerHTML =  '<tr><td>'+tag+'</td></tr>';
        })
    });
}