const btn_submit = document.querySelector('#btn-submit');
const m = document.querySelector('#message-div');
const form = document.querySelector('#entry-form');

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

    
}

window.CRUD.createResponse((message) => {
    m.innerHTML = message;
});

function retreiveFormData() {

}

//idea for later: Also should have a method for asychronously checking for tags being added and edit the look of comma separated tags
