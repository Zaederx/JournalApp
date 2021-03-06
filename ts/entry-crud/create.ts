
/**
 * Used to display messages.
 */
const messageDiv:HTMLElement|null = document.querySelector('#message-div');
/** Used to save new entries */
const btn_submit:HTMLElement|null = document.querySelector(saveNewEntryId);


/********** Submit New Entry ********** */ 
if(btn_submit != null)
    btn_submit.onclick = (event) => submit(event);
else console.error('create.ts: var btn_submit = null');


var e = new Entry()//for access to conversion methods

function submit (event:Event) {
    window.logAPI.message('form submit button clicked\n');
    // var neTitle:HTMLElement|null = document.querySelector('#new-entry-title');
    var etitle:string|null = (document.querySelector('#edit-e-title') as HTMLInputElement).innerText as string;
    var ebody:string = (document.querySelector('#edit-e-body') as HTMLDivElement).textContent as string;
    // var etags:string|null = (document.querySelector('#new-entry-tags') as HTMLInputElement).value;
    var etags:string|null = tags //from add-tag-searchbar.ts
    var message:string = 'title:' + etitle + ' body:' + ebody + ' tags:' + etags;
    console.log('message:',message);
    window.logAPI.message(message);
    var entry = new Entry(etitle, ebody, e.stringToArr(etags));
    var entryJSON:string = JSON.stringify(entry);
    window.logAPI.message(entryJSON);

    //need to call method that creates entry file in file system
    window.CRUD.createEntry(entryJSON);
    event.preventDefault();//to disable postback - otherwise causes problems with updating content

    //TODO call a method that symlinks the file to all tags folders

    if(form != null) form.reset();//because default are disabled

    refresh();//from read.js
    
}



/**
 * Recieves and displays success of failure messages.
 * i.e. Whether Entry saved succesfully or not.
 */
window.CRUD.createEntryResponse((message:string) => {
    if (messageDiv != null) messageDiv.innerHTML = message;
});

//TODO idea for later: Also should have a method for asychronously checking for tags being added and edit the look of comma separated tags
console.log('width:',window.outerWidth, 'height:',window.outerHeight);