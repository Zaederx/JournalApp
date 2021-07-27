import { ipcRenderer } from "electron"

class ClickableTable {

    plain = ''//'rgb(224, 221, 210)';//'#e0ddd2'//only works with rgb - becuase style.backgroundColor property is returned in rgb
    highlighted = 'rgb(255, 245, 107)' //'#fff56b';
    clicked = 'rgb(240, 92, 53)'//'#f05c35';

    //to initialise
    searchbar:HTMLDivElement
    addBtn:HTMLDivElement
    removeBtn:HTMLDivElement
    tableBody:HTMLTableElement
    messageDiv:HTMLDivElement

    constructor(searchbarId:string,addBtnId:string,removeBtnId:string,tableBodyId:string,messageDivId:string) {
        this.searchbar = document.querySelector(searchbarId) as HTMLDivElement
        this.addBtn = document.querySelector(addBtnId) as HTMLDivElement
        this.removeBtn = document.querySelector(removeBtnId) as HTMLDivElement
        this.tableBody = document.querySelector(tableBodyId) as HTMLTableElement
        this.messageDiv = document.querySelector(messageDivId) as HTMLTableElement
    }

    /**
 * Get Selected Tags
 * @param tagTableBody tableBody to get rows from
 * @returns 
 */
    getSelectdTags(tagTableBody:HTMLTableElement=this.tableBody) {
        var rows = tagTableBody?.querySelectorAll('tr')
        var tags:string[] = []
        rows.forEach( row => {
            //add tags if selected/clicked
            if (row.style.backgroundColor == this.clicked) {
                tags.push(row.cells[0].innerHTML)
            }
        })
        return tags
    }

    async addSelectedTagsToEntry(refreshFunc:Function) {
        //get selected tags
        var selectedTags:string[] = this.getSelectdTags()
        //get current entry
        var entryJson = await ipcRenderer.invoke('get-current-entry')
        var entry:Entry = JSON.parse(entryJson)
        //for each tag - if not already in tags list -> add to list
        var tagSet = new Set(entry.tags)
        selectedTags.forEach (tag => {
            //if has new - dont add, else add newTag to entry.tags
            tagSet.has(tag) ? null : entry.tags.push(tag)
        })
        //persist changes
        var newEntryJson = JSON.stringify(entry)
        var message = await ipcRenderer.invoke('update-current-entry',newEntryJson)
        //display message
        this.messageDiv.innerText = message
        //page refresh
        refreshFunc()
    }

}