"use strict";
const btn_submit = document.querySelector('#btn-submit');
const btn_addEntry = document.querySelector('#e-create');
const messageDiv = document.querySelector('#message-div');
/** Form for submitting entries and entry updates */
const form = document.querySelector('#entry-form');
/** #entry-view */
const eView = document.querySelector('#entry-view');
const neView = document.querySelector('#new-entry-view');
/********** Open New Entry View ********** */
if (btn_addEntry != null)
    btn_addEntry.onclick = (event) => displayNEView();
else
    console.error('create.ts: var btn_addEntry = null');
/********** Submit New Entry ********** */
if (btn_submit != null)
    btn_submit.onclick = (event) => submit(event);
else
    console.error('create.ts: var btn_submit = null');
function submit(event) {
    window.logAPI.message('form submit button clicked\n');
    // var neTitle:HTMLElement|null = document.querySelector('#new-entry-title');
    var etitle = document.querySelector('#new-entry-title').value;
    var ebody = document.querySelector('#new-entry-body').value;
    var etags = document.querySelector('#new-entry-tags').value;
    var message = 'title:' + etitle + ' body:' + ebody + ' tags:' + etags;
    console.log('message:', message);
    window.logAPI.message(message);
    var entry = new Entry(etitle, ebody, etags);
    var entryJSON = JSON.stringify(entry);
    window.logAPI.message(entryJSON);
    //need to call method that creates entry file in file system
    window.CRUD.createEntry(entryJSON);
    event.preventDefault(); //to disable postback - otherwise causes problems with updating content
    //call a method that symlinks the file to all tags folders
    if (form != null)
        form.reset(); //because default are disabled
    refresh(); //from read.js
}
window.CRUD.createEntryResponse((message) => {
    if (messageDiv != null)
        messageDiv.innerHTML = message;
});
//idea for later: Also should have a method for asychronously checking for tags being added and edit the look of comma separated tags
console.log('width:', window.outerWidth, 'height:', window.outerHeight);
