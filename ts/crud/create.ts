const btn_submit:HTMLElement|null = document.querySelector('#btn-submit');
const btn_addEntry:HTMLElement|null = document.querySelector('#e-create');
const messageDiv:HTMLElement|null = document.querySelector('#message-div');


/********** Open New Entry View ********** */ 
if (btn_addEntry != null)
    btn_addEntry.onclick = (event) => displayNEView();
else console.error('create.ts: var btn_addEntry = null');

/********** Submit New Entry ********** */ 
if(btn_submit != null)
    btn_submit.onclick = (event) => submit(event);
else console.error('create.ts: var btn_submit = null');



function submit (event) {
    window.logAPI.message('form submit button clicked\n');
    // var neTitle:HTMLElement|null = document.querySelector('#new-entry-title');
    var etitle:string|null = (document.querySelector('#new-entry-title') as HTMLInputElement).value;
    var ebody:string|null = (document.querySelector('#new-entry-body')as HTMLInputElement).value;
    var etags:string|null = (document.querySelector('#new-entry-tags')as HTMLInputElement).value;
    var message:string = 'title:' + etitle + ' body:' + ebody + ' tags:' + etags;
    console.log('message:',message);
    window.logAPI.message(message);
    var entry = new Entry(etitle, ebody, etags);
    var entryJSON:string = JSON.stringify(entry);
    window.logAPI.message(entryJSON);

    //need to call method that creates entry file in file system
    window.CRUD.createEntry(entryJSON);
    event.preventDefault();//to disable postback - otherwise causes problems with updating content

    //TODO call a method that symlinks the file to all tags folders

    if(form != null) form.reset();//because default are disabled

    refresh();//from read.js
    
}

window.CRUD.createEntryResponse((message:string) => {
    if (messageDiv != null) messageDiv.innerHTML = message;
});

//TODO idea for later: Also should have a method for asychronously checking for tags being added and edit the look of comma separated tags
console.log('width:',window.outerWidth, 'height:',window.outerHeight);