const btn_submit = document.querySelector('#btn-submit');
const btn_addEntry = document.querySelector('#e-create');
const m = document.querySelector('#message-div');
const form = document.querySelector('#entry-form');
const eView = document.querySelector('#entry-view');
const neView = document.querySelector('#new-entry-view');

/********** Open New Entry View ********** */ 
btn_addEntry.onclick = function(event) {
    eView.setAttribute('hidden','')
    neView.removeAttribute('hidden');
}


/********** Submit New Entry ********** */ 
btn_submit.onclick = function (event) {
    window.logAPI.message('test');
    title = document.querySelector('#new-entry-title').value;
    body = document.querySelector('#new-entry-body').value;
    tags = document.querySelector('#new-entry-tags').value;
    message = 'title:' + title + ' body:' + body + ' tags:' + tags;
    window.logAPI.message(message);
    entry = new Entry(title, body, tags);
    entryJSON = JSON.stringify(entry);
    window.logAPI.message(entryJSON);
    window.logAPI.message('test');


    //need to call method that creates entry file in file system
    window.CRUD.createEntry(entryJSON);
    event.preventDefault();//to disable postback - otherwise causes problems with updating content

    //call a method that symlinks the file to all tags folders
    form.reset();//because default are disabled

    refresh();//from read.js
    
}

window.CRUD.createResponse((message) => {
    m.innerHTML = message;
});

//idea for later: Also should have a method for asychronously checking for tags being added and edit the look of comma separated tags
console.log('width:',window.outerWidth, 'height:',window.outerHeight);