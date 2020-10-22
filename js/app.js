const btn_submit = document.querySelector("#btn-submit");

btn_submit.onclick = function () {
    window.logAPI.message('console', "test");
    title = document.querySelector("#new-entry-title").value;
    body = document.querySelector("#new-entry-body").value;
    tags = document.querySelector("#new-entry-tags").value;
    message = "title:" + title + " body:" + body + " tags:" + tags;
    window.logAPI.message('console', message);
    entry = new Entry(title, body, tags);
    entryJSON = JSON.stringify(entry);
    window.logAPI.message('console', entryJSON);
    window.logAPI.message('console', "test");


    //need to call method that creates entry file in file system
    window.CRUD.createEntry('create_Entry', entryJSON);

    //call a method that symlinks the file to all tags folders
}

window.CRUD.createEntry('response-c', (message) => {
    //what you would like to do with the message
    m = document.querySelector('#message-div');
    m.innerHTML = message;
});

function retreiveFormData() {

}

//idea for later: Also should have a method for asychronously checking for tags being added and edit the look of comma separated tags
