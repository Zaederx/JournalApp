//Read tag directories on page/document load
$(document).ready(function() { 
    getTopics();
    getEntries();
});

/**
 * Retrieves and displays Topic/Tag names.
 * These are the names displayed in the Topics/Tags 
 * (#topics div) sidepanel of main.html.
 */
function getTopics() {
    window.CRUD.readDirectories();//reads tag directories
    //return topics to html side panel
    window.CRUD.readDResponse(function(dirHTML:string) {
        var topics:HTMLElement|null = document.querySelector('#topics');
        if (topics !=null) topics.innerHTML = dirHTML;
        else console.error('read.ts: var topics = null')
        
    });
}

/**
 * Retrieves and displays all Entry filenames from default directory.
 * These entries are displayed on the Entry File panel/sidebar.
 * This function also calls makeClickable() on each entryfile div
 * (allowing these div's to act like buttons that display file contents when clicked,
 *  and has one button highlighted as active).
 * 
 * Note: here the use of #files refers to the div containing the list
 * all entry filenames on main.html. This list can be clicked like buttons
 * in order to display each cooresponding file's contents.
 */
function getEntries() {
    //fill side panel with file names
    var directoryName:string = 'all';
    window.CRUD.readDirectoryEntries(directoryName);
    window.CRUD.readDEResponse(function(filesHTML:string) {
    var files:HTMLElement|null = document.querySelector('#files');
    if (files != null) files.innerHTML = filesHTML;
    else console.error('read.ts: var files = null');
        //needed to display a selected file on click
        //fills #files div with many -> <div>{filename}</div>
        $('#files').find('div').each(function() {
            var entryDiv:HTMLDivElement = this;
            makeClickable(entryDiv);
        });
    });

}


/** Enables the button -> makes button functional and applies CSS styling.
 * This allows these div's to act like buttons that display file contents when clicked,
 * and have one button highlighted as active.
 */
function makeClickable(entryDiv:HTMLDivElement) {
    entryDiv.onclick = () => {
        if(messageDiv != null) messageDiv.innerHTML = "";
        else console.log('read.ts: var messageDiv = null');
        var filename:string = entryDiv.innerHTML;
        setEntryFilename(filename);
        displayEView();
        
        window.CRUD.readEntry(filename);       
        highlightActiveEntry(entryDiv);
       
    };
}





//convience method
/**
 * Calls methods getTopics() and getEntries().
 */
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
    (document.querySelector('#e-title') as HTMLInputElement).innerHTML = entry.title;
    (document.querySelector('#e-body') as HTMLInputElement).innerHTML = entry.body;
    (document.querySelector('#e-tags') as HTMLInputElement).innerHTML = entry.tags;
}