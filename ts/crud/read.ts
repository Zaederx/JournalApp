//Read tag directories on page/document load
$(document).ready(function() { 
    getTopics();
    getEntries();
});

//retrieves and dsiplays Topics names in Topics sidepanel
function getTopics() {
    window.CRUD.readDirectories();//reads tag directories
    //return topics to html side panel
    window.CRUD.readDResponse(function(dirHTML) {
        document.querySelector('#topics').innerHTML = dirHTML;
    });
}
//retrieves and displays all Entry filenames from default directory
function getEntries() {
    //fill side panel with file names
    var directoryName = 'all'
    window.CRUD.readDirectoryEntries(directoryName);
    window.CRUD.readDEResponse(function(filesHTML) {
    document.querySelector('#files').innerHTML = filesHTML;
        //to display a selected file on click
        //fills #files div with many -> <div>{filename}</div>
        $('#files').find('div').each(function() {
            entryBtn = this;
            makeClickable(entryBtn);
        });
    });

}


/** Enables the button -> makes button functional and applies CSS styling */
function makeClickable(entryBtn) {
    entryBtn.onclick = () => {
        messageDiv.innerHTML = "";
        var filename = entryBtn.innerHTML;
        setEntryFilename(filename);
        displayEView();
        
        window.CRUD.readEntry(filename);       
        highlightActiveEntry(entryBtn);
       
    };
}





//convience method
function refresh() {
    getTopics();
    getEntries();
}


// note to self $('#id') =! documetn.querySelector('#id')
//the second returns the element, the first does not.

/** Read the response to entries being clicked */
window.CRUD.readEntryResponse(function (fileContent) {
    console.log('Entry recieved. Displaying entry...');
    var entry = JSON.parse(fileContent);
    setECurrent(entry);//sets selectedEntry variable var.js
    displayEntry(entry);
    console.log('Entry "'+entry.title+'" displayed.');
});

function displayEntry(entry) {
    document.querySelector('#e-title').innerHTML = entry.title;
    document.querySelector('#e-body').innerHTML = entry.body;
    document.querySelector('#e-tags').innerHTML = entry.tags;
}