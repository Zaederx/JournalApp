// *** Function Definitions ***
import { blurBackground, unblurBackground } from "./background-blur"
import { fillTagTable, constants as c } from "../clickable-filter-table/table"

//SECTION Toggling Popup

var hidden = true
export function toggleTagPopup(blurDiv:HTMLDivElement, popup:HTMLDivElement, tagTableBody:HTMLTableElement) {
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

/**
 * Get Selected Tags
 * @param tagTableBody tableBody to get rows from
 * @returns 
 */
function getSelectedTags(tagTableBody:HTMLTableElement) {
    console.log('function getSelectedTags called')
    var rows = tagTableBody?.querySelectorAll('tr')
    var tags:string[] = []
    rows.forEach( row => {
        //add tags if selected/clicked
        if (row.style.backgroundColor == c.clicked) {
            tags.push(row.cells[0].innerHTML)
        }
    })
    return tags
}

