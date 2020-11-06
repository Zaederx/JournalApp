const btn_update = document.querySelector('#e-update');
var etitle = document.querySelector('#new-entry-title');
var ebody = document.querySelector('#new-entry-body');
var etags = document.querySelector('#new-entry-tags');
const btn_submit_update = document.querySelector('#btn-submit-update');

btn_submit_update.onclick = (event) => {updateFile(event)};

function updateFile(event) {
    window.logAPI.message('form submit button clicked\n');

    var etitle = document.querySelector('#new-entry-title').value;
    var ebody = document.querySelector('#new-entry-body').value;
    var etags = document.querySelector('#new-entry-tags').value;
    var message = 'title:' + etitle + ' body:' + ebody + ' tags:' + etags;
    console.log('message:',message);
    window.logAPI.message(message);


    var entry = new Entry(etitle, ebody, etags);
    var entryJSON = JSON.stringify(entry);
    window.logAPI.message(entryJSON);

    var filename = getEntryFilename();//from vars.js
    
    //need to call method that creates entry file in file system
    window.CRUD.updateEntry(entryJSON, filename);
    event.preventDefault();//to disable postback - otherwise causes problems with updating content

    //call a method that symlinks the file to all tags folders
    form.reset();//because default are disabled

    refresh();//from read.js
}
btn_update.onclick = (event) => updateForm(event);

function updateForm(event) {
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