const btn_update = document.querySelector('#e-update');
const title = document.querySelector('#new-entry-title');
const body = document.querySelector('#new-entry-body');
const tags = document.querySelector('#new-entry-tags');
btn_update.onclick = function update(event) {
    //display 'new-entry-view'
    displayNEView();
    //read entry
    entry = getECurrent();//from vars.js
    
    //insert into fields
    title.value =  entry.title;
    body.value = entry.body;
    tags.value = entry.tags;

    //read fields for changes
    

    //create entry of same name to replace original

    //delete original?

    //save new entry
}