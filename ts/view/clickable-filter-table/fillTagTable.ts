import { ipcRenderer } from "electron";
import makeTTRowClickable from "./makeTTRowClickable";

//fill tag popup table
export default async function fillTagTable(tableBody:HTMLTableElement) {
    console.log('function fillTagTable called')
    //get all html tag
    var tagsHTMLRows = await ipcRenderer.invoke('get-tags-table-rows')
    console.log('tagsHTML',tagsHTMLRows)
    //fill table with html tag information
    tableBody.innerHTML = tagsHTMLRows
    var rows = tableBody?.querySelectorAll('tr');
    //make row clickable - i.e. highlight on click and mouseover events
    rows?.forEach( row => {
        makeTTRowClickable(row as HTMLTableRowElement);
        //if row is for the all tag - remove event highlighting
        if (row.cells[0].innerText == 'all') 
        {
            row.addEventListener('mouseover', function(){})
            row.addEventListener('mouseleave', function(){})
            row.addEventListener('mouseclick', function (){})
            row.style.backgroundColor = ''
        }
    });
}