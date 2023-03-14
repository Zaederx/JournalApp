import { clicked } from "./constants"

/**
 * Get Selected Tags
 * @param tagTableBody tableBody to get rows from
 * @returns 
 */
export function getSelectedTags(tagTableBody:HTMLTableElement) {
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
