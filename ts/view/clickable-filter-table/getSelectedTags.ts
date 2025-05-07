import { clicked } from "./constants"

/**
 * Get selected (highlighted) tags from a the tag table body.
 * Any row where the tag is the clicked colour,
 * it's tag will be added to the list of tags.
 * Used for the `edit-tags` view. 
 * See `html/edit-tags.html` and `ts/view/edit-tags.ts`
 * @param tagTableBody tableBody to get rows from
 * @returns 
 */
export default function getSelectedTags(tagTableBody:HTMLTableElement) {
    console.log('function getSelectedTags called')
    var rows = tagTableBody?.querySelectorAll('tr')
    var tags:string[] = []
    rows.forEach( row => {
        //add tags if selected/clicked
        if (row.style.backgroundColor == clicked) {
            //cell 0 is the cell with the tag name
            tags.push(row.cells[0].innerText)
        }
    })
    return tags
}
