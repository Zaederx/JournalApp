/****Current Tag and Entry information*** */
var selectedEntry = new Entry('default','default','default');
var selectedTag = '';

function getECurrent() {
    console.log("vars:getECurrent:"+selectedEntry.title)
    return selectedEntry;
}

function setECurrent(entry) {
    

    console.log("vars:setECurrent")
    selectedEntry = entry;
}

function getTagCurrent() {
    console.log("vars:getTagCurrent")
    return selectedTag;
}


function setTagCurrent(tag) {
    console.log("vars:setTagCurrent")
    selectedTag = tag;
}

/*** Entry and NewEntry Views ** */

function displayEView() {
    eView.removeAttribute('hidden');
    neView.setAttribute('hidden','');//from create.js
    form.reset();
}
function displayNEView() {
    neView.removeAttribute('hidden');
    eView.setAttribute('hidden','');//from create.js
    form.reset();
}

/****** Highlight Active Entry or Tag **** */
function highlightActiveEntry(entryBtn) {
    console.log('highlightActiveEntry')
     //handle css div-button styling
     var lastActive = document.querySelector('.active.entry');
     lastActive.className = lastActive.className.replace('active entry', '');
     entryBtn.className += 'active entry';
}

function highlightActiveTag(tagBtn) {
    //handle css div-button styling
    var lastActive = document.querySelector('.active.tag');
    lastActive.className = lastActive.className.replace('active tag', '');
    tagBtn.className += 'active tag';
}