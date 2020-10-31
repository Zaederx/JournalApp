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

