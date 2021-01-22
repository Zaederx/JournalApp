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
        
        if(tagTableBody != null)
        tagTableBody.innerHTML =  tagsToHtml(tags);
    });
}

/**
 * Encloses tag names in html.
 * This is used in preparation for being added
 * to html table body.
 * 
 * i.e.:
 * ``` 
 * var html:string = '';
 * tags.forEach( tag => {
 *     html += '<tr><td>'+tag+'</td></tr>\n';
 * });
 * return html;
 * ```
 * @param tags array of tagnames
 * @return html
 */
function tagsToHtml(tags:string[]):string {
    var html:string = '';
    tags.forEach( tag => {
        if (tag.charAt(0) == '.') {/* Do not add .DS_STORE / System files*/}
        else html += '<tr><td>'+tag+'</td></tr>\n';
    });
    return html;
}