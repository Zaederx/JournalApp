// *** Function Definitions ***
import { blurBackground, unblurBackground } from "./background-blur"
import { fillTagTable, constants as c } from "../clickable-filter-table/table"

//SECTION Toggling Popup

var hidden = true
export default function toggleTagPopup(blurDiv:HTMLDivElement, popup:HTMLDivElement, tagTableBody:HTMLTableElement) {
    console.warn('function toggleTagPopup called')
    //if hidden open tag popup
    if (hidden == true) {
        displayTagPopup(popup)
        fillTagTable(tagTableBody)
        blurBackground(blurDiv)
        hidden = false
    }
    //else hide tag popup
    else {
        hideTagPopup(popup)
        unblurBackground(blurDiv)
        hidden = true
    }
}



function displayTagPopup(popup:HTMLDivElement) {
    console.log('function displayTagPopup called')
    //display edit tag popup
    popup.style.display = 'grid'
}

function hideTagPopup(popup:HTMLDivElement) {
    console.log('function hideTagPopup called')
    //display edit tag popup
    popup.style.display = 'none'
}

