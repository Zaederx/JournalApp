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
    window.CRUD.readTags();//reads tag directories
    //return topics to html side panel
    window.CRUD.readTResponse(function(dirHTML:string) {
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
    window.CRUD.readTagDirectory(directoryName);
    window.CRUD.readTDResponse(function(filesHTML:string) {
        //fills #files div with many -> <div>{filename}</div>
        var files:HTMLElement|null = document.querySelector('#files');
        if (files != null) files.innerHTML = filesHTML;
        else console.error('read.ts: var files = null');
        files?.childNodes.forEach( entry => makeClickable(entry as HTMLDivElement,highlightActiveEntry));
    });

}


/** Enables the button -> makes button functional and applies CSS styling.
 * This allows these div's to act like buttons 
 * that display file contents when clicked,
 * and have one button highlighted as active.
 * @param element   element to be made clickable
 * @param highlightActive   function for highlighting the element
 * i.e. `highlightActiveEntry` or `highlightActiveTag`
 */
function makeClickable(element:HTMLDivElement, highlightActive:Function) {
    element.onclick = () => {
        if(messageDiv != null) messageDiv.innerHTML = "";
        else console.log('read.ts: var messageDiv = null');
        var filename:string = element.innerHTML;
        setEntryFilename(filename);
        displayEView(); 
        window.CRUD.readEntry(filename);       
        highlightActive(element);
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
window.CRUD.readEntryResponse(function (fileContent:string) {
    console.log('Entry recieved. Displaying entry...');
    var entry = JSON.parse(fileContent);
    setECurrent(entry);//sets selectedEntry variable var.js
    displayEntry(entry);
    console.log('Entry "'+entry.title+'" displayed.');
});

/**
 * Displays an entry on the screen.
 * @param entry Entry to be displayed
 */
function displayEntry(entry:Entry) {
    (document.querySelector('#e-title') as HTMLInputElement).innerHTML = entry.title;
    (document.querySelector('#e-body-text') as HTMLInputElement).innerHTML = entry.body;
    (document.querySelector('#e-tags') as HTMLInputElement).innerHTML = entry.tags;
}