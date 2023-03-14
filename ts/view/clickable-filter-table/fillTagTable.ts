import { ipcRenderer } from "electron";
import { makeTTRowClickable } from "./makeTTRowClickable";

//fill tag popup table
export async function fillTagTable(tableBody:HTMLTableElement) {
    //get all html tag
    var tagsHTMLRows = await ipcRenderer.invoke('get-tags-table-rows')
    console.log('tagsHTML',tagsHTMLRows)
    //fill table with html tag information
    tableBody.innerHTML = tagsHTMLRows
    var rows = tableBody?.querySelectorAll('tr');
    //make row clickable - i.e. highlight on click and mouseover events
    rows?.forEach( row => {
        makeTTRowClickable(row as HTMLTableRowElement);
    });
}