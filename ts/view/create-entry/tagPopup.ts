
// *** Function Definitions ***

import { blurBackground, unblurBackground } from "./background-blur"
import { fillTagTable } from "../clickable-filter-table/fillTagTable"
import { clicked } from "../clickable-filter-table/constants"

//SECTION Toggling Popup

var hidden = true
export function toggleAddTagPopup(blurDiv:HTMLDivElement, popup:HTMLDivElement, tagTableBody:HTMLTableElement) {
    console.warn('addEntryTag called')
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
    //display edit tag popup
    popup.style.display = 'grid'
}

function hideTagPopup(popup:HTMLDivElement) {
    //display edit tag popup
    popup.style.display = 'none'
}

/**
 * Get Selected Tags
 * @param tagTableBody tableBody to get rows from
 * @returns 
 */
function getSelectdTags(tagTableBody:HTMLTableElement) {
    var rows = tagTableBody?.querySelectorAll('tr')
    var tags:string[] = []
    rows.forEach( row => {
        //add tags if selected/clicked
        if (row.style.backgroundColor == clicked) {
            tags.push(row.cells[0].innerHTML)
        }
    })
    return tags
}

