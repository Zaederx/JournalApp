const btn_update = document.querySelector('#e-update');
var etitle = document.querySelector('#new-entry-title');
var ebody = document.querySelector('#new-entry-body');
var etags = document.querySelector('#new-entry-tags');

btn_update.onclick = function update(event) {
    //display 'new-entry-view'
    displayNEView();
    //read entry
    entry = getECurrent();//from vars.js
    
    //insert into fields
    etitle.value =  entry.title;
    ebody.value = entry.body;
    etags.value = entry.tags;

    //read fields for changes
    

    //create entry of same name to replace original

    //delete original?

    //save new entry
}