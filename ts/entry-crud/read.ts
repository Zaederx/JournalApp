//Read tag directories on page/document load
$(document).ready(function() { 
    getTopics();
    getEntries();
});
//SECTION - Get Topics & Get Entries
/**
 * Retrieves and displays Topic/Tag names.
 * These are the names displayed in the Topics/Tags 
 * (#topics div) sidepanel of main.html.
 */
function getTopics() {
    window.CRUD.readTags();//reads tag directories
    //return topics to html side panel
    window.CRUD.readTResponse(loadTags);
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
    window.CRUD.readTDResponse(loadEntries);
}

/**
 * Calls methods getTopics() and getEntries().
 * Convienience method.
 */
function refresh() {
    getTopics();
    getEntries();
}

//SECTION - Make Clickable

/** Enables the button -> makes button functional and applies CSS styling.
 * This allows these div's to act like buttons 
 * that display file contents when clicked,
 * and have one button highlighted as active.
 * @param element   element to be made clickable
 * @param highlightActive   function for highlighting the element
 * i.e. `highlightActiveEntry` or `highlightActiveTag`
 */
function makeClickable(element:HTMLDivElement, readFunction:Function,highlightActive:Function) {
    element.onclick = () => {
        if(messageDiv != null) messageDiv.innerHTML = "";
        else console.log('read.ts: var messageDiv = null');
        var filename:string = element.innerHTML;
        setEntryFilename(filename);//needs to be set - important for file deletion
        displayEView(); 
        readFunction(filename);       
        highlightActive(element);
    };
}


/* IMPORTANT note to self $('#id') =! documetn.querySelector('#id')
the second returns the acutal element, the first does not. */

// SECTION - Window C.R.U.D Response Function Calls + Display Entry Function

/** Read the response to entries being clicked
 * and displays then in the entry view.
 */
window.CRUD.readEntryResponse(function (fileContent:string) {
    console.log('Entry recieved. Displaying entry...');
    var entry = JSON.parse(fileContent);
    setECurrent(entry);//sets selectedEntry variable var.js
    displayEntry(entry);
    console.log('Entry "'+entry.title+'" displayed.');
});

/**
 * Reads the reponse (entries) to tags being clicked
 * and loads these into the entry side panel.
 */
window.tagCRUD.readTagEntriesR(function (tagEntriesHTML:string) {
    console.log('Tag recieved, Display loag tag entries...');
    loadEntries(tagEntriesHTML);
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

//  SECTION - Loading Functions - for Tag & Entry
/**
 * Loads entry side panel with clickable entries
 * @param entriesHTML list of entry names (as HTML) 
 * to be loaded into #files side panel
 */
function loadEntries(entriesHTML:string) {
    console.log('loadEntries called');
    //fills #files div with many -> <div>{filename}</div>
    var entries:HTMLElement|null = document.querySelector('#files');
    if (entries != null) entries.innerHTML = entriesHTML;
    else console.error('read.ts: var files = null');
    entries?.childNodes.forEach( entry => makeClickable(entry as HTMLDivElement, window.CRUD.readEntry, highlightActiveEntry));
}

/**
 * Loads tag side panel with clickable tags
 * @param tagsHTML list of tag names (as HTML) 
 * to be loaded into #topics side panel
 */
function loadTags(tagsHTML:string) {
    var tags:HTMLElement|null = document.querySelector('#topics');
    if (tags !=null) tags.innerHTML = tagsHTML;
    else console.error('read.ts: var topics = null')
    tags?.childNodes.forEach(tag => makeClickable(tag as HTMLDivElement, window.tagCRUD.readTagEntries,highlightActiveTag));
}


