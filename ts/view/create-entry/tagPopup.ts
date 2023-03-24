// *** Function Definitions ***
import { blurBackground, unblurBackground } from "./background-blur"
import { fillTagTable, constants as c } from "../clickable-filter-table/table"

//SECTION Toggling Popup

var hidden = true
export default function toggleTagPopup(blurDiv:HTMLDivElement, tagTableBody:HTMLTableElement) {
    console.warn('function toggleTagPopup called')
    //if hidden open tag popup
    if (hidden == true) {
        displayTagPopup()
        fillTagTable(tagTableBody)
        blurBackground(blurDiv)
        hidden = false
    }
    //else hide tag popup
    else {
        hideTagPopup()
        unblurBackground(blurDiv)
        hidden = true
    }
}



function displayTagPopup() {
    console.log('function displayTagPopup called');
    //display edit tag popup
    (document.querySelector('#add-tags-popup')as HTMLDivElement).style.display = 'grid'
}

function hideTagPopup() {
    console.log('function hideTagPopup called');
    //display edit tag popup
    (document.querySelector('#add-tags-popup')as HTMLDivElement).style.display = 'none'
}

