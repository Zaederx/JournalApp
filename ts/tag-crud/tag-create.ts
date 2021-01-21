const btn_addTag:HTMLElement|null = document.querySelector('#t-create');
const tagTableBody:HTMLTableElement|null = document.querySelector('#tag-table-body');

//TODO Add a succesful message/alert box adding a new tag

if(btn_addTag != null)
btn_addTag.onclick = () => displayTagView();


function addTag(tagname:string) {
    //add tag folder to tagDirs
    window.tagCRUD.create(tagname);
}


/**
 * Fills tag table with all tags.
 */
function loadTagTable() {
    //ipcMessage - requests tag to be read
    window.CRUD.readTags(); 
    //wait for for ipc response -> load tag table
    window.CRUD.readTResponse((tagsHTML:string) => {
        if (tagTableBody != null)
        tagTableBody.innerHTML = tagsHTML;
    });
}