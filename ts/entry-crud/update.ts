/** Button used to open the update entry view (by displaying the #new-entry-view div) */
const btn_update:HTMLElement|null = document.querySelector('#e-update');//btn to open update view
/** Button used to submit update changes. */
const btn_submit_update:HTMLElement|null = document.querySelector('#btn-submit-update');
const etitle:HTMLInputElement|null = document.querySelector('#new-entry-title');
const ebody:HTMLInputElement|null = document.querySelector('#new-entry-body');
const etags:HTMLInputElement|null = document.querySelector('#new-entry-tags');


if(btn_submit_update != null)
    btn_submit_update.onclick = (event) => {updateFile(event)};
else console.error('update.ts: var btn_submit_update = null');

function updateFile(event:Event) {
    window.logAPI.message('form submit button clicked\n');

    var etitle = (document.querySelector('#new-entry-title') as HTMLInputElement).value;
    var ebody = (document.querySelector('#new-entry-body') as HTMLInputElement).value;
    var etags = (document.querySelector('#new-entry-tags') as HTMLInputElement).value;
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
    if (form != null)
    form.reset();//because default are disabled

    refresh();//from read.js
}
if (btn_update != null)
btn_update.onclick = (event) => getUpdateForm(event);

/** Displays the update form.
 * Also fills that form with information of the 
 * currently selected Entry */
function getUpdateForm(event:Event) {
    //display 'new-entry-view'
    displayNEView();
    //read entry
    var entry:Entry = getECurrent();//from vars.js
    
    //insert into fields
    if(etitle != null) etitle.value =  entry.title;
    else console.error('update.ts: const etitle = null')

    if(ebody != null) ebody.value = entry.body;
    else console.error('update.ts: const ebody = null')

    if(etags != null) etags.value = entry.tags;
    else console.error('update.ts: const etags = null')
}