/*Current Tag and Entry information*/



/** Variable for information of the currently selected entry*/
var selectedEntry = new Entry('default','default',[]);
/** Variable for information of the currently selected tag*/
var selectedTag = '';
/** Variable for the filename of the currently selected entry */ 
var selectedEntryFilename = '';//TODO souldn't this just be in the Entry class ????

//TODO Work on Entry and Tag Cache - to increase efficiency
var EntryCache:Entry[];
// var TagCache:Tag[];
/**
 * Returns the currently selected entry.
 * This will be the entry selected by a user 
 * in the Entry panel/sidebar list on main.html.
 * @return selectedEntry
 */
function getECurrent():Entry {
    console.log("vars:getECurrent:"+selectedEntry.title)
    return selectedEntry;
}

/**
 * Sets the current Entry variable.
 * @param entry 
 */
function setECurrent(entry:Entry) {
    console.log("vars:setECurrent")
    selectedEntry = entry;
}

/**
 * Returns the selectedEntries filename.
 */
function getEntryFilename():string {
    return selectedEntryFilename;
}

/**
 * Sets the selectedEntryFilename variable.
 * Is set to be called the within the 
 * onclick event function of every entry.
 * (see read.ts makeclickable function)
 * @param filename the name of the entry's file
 */
function setEntryFilename(filename:string) {
    selectedEntryFilename = filename;
}

function getTagCurrent() {
    console.log("vars:getTagCurrent")
    return selectedTag;
}


function setTagCurrent(tag:string) {
    console.log("vars:setTagCurrent")
    selectedTag = tag;
}

