// *** Function Definitions ***
import { blurBackground, unblurBackground } from "./background-blur"
import { fillTagTable, constants as c } from "../clickable-filter-table/table"
import { printFormatted } from "../../other/stringFormatting"

//SECTION Toggling Popup


/**
 * Opens and closes the tag popup div.
 * @param blurDiv 
 * @param tagTableBody 
 */
export default function toggleTagPopup(blurDiv:HTMLDivElement, tagTableBody:HTMLTableElement, hidden:{bool:boolean}) {
    console.warn('function toggleTagPopup called')
    printFormatted('green', 'hidden:',hidden.bool)
    //if hidden open tag popup
    if (hidden.bool == true) {
        hidden.bool = false
        displayTagPopup()
        fillTagTable(tagTableBody)
        blurBackground(blurDiv)
        
    }
    //else hide tag popup
    else {
        hidden.bool = true
        hideTagPopup()
        unblurBackground(blurDiv)
    }
}



function displayTagPopup() {
    console.log('function displayTagPopup called');
    //display edit tag popup
    (document.querySelector('#add-tags-popup')as HTMLDivElement).style.display = 'grid'
}

export function hideTagPopup() {
    console.log('function hideTagPopup called');
    //display edit tag popup
    (document.querySelector('#add-tags-popup')as HTMLDivElement).style.display = 'none'
}

