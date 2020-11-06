/****Current Tag and Entry information*** */
selectedEntry = 'default';
selectedTag = 'default';

function getECurrent() {
    console.log("vars:getECurrent")
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

function displayNEView() {
    eView.removeAttribute('hidden');
    neView.setAttribute('hidden','');//from create.js
}
function displayEView() {
    neView.removeAttribute('hidden');
    eView.setAttribute('hidden','');//from create.js
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