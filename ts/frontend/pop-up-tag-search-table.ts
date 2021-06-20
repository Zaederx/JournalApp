
const table_input = document.querySelector('#tag-input') as HTMLDivElement

table_input ? table_input.onclick = () => clearSearchbar() : console.log('table_input is null')
table_input.onkeyup = () => filterTable()

function clearSearchbar() {
    table_input.innerText = ''
}

const btn_manage_entry_tags = document.querySelector('#manage-entry-tags') as HTMLDivElement

btn_manage_entry_tags ? btn_manage_entry_tags.onclick = () => togglePopUpTable() : console.log('btn_manage_entry_tags is null')


const popUpTable = document.querySelector('#pop-up-tag-search-table') as HTMLDivElement


function displayPopUpTable() {
    popUpTable.style.display = 'block'
    //@ts-ignore - says there is no function - there is in another file - it works
    loadTagTable()  //from tag-read.ts
}

function hidePopUpTable() {
    popUpTable.style.display = 'none'
}

var popTableVisible = false
function togglePopUpTable() {
    if (popTableVisible) {
        hidePopUpTable()
        popTableVisible = false
    }
    else {
        displayPopUpTable()
        popTableVisible = true
    }
    console.log('popUpTableVisible:',popTableVisible)
}

const btn_plusTag = document.querySelector('#plus-btn') as HTMLDivElement
btn_plusTag ? btn_plusTag.onclick = () => addTagToEntry() : console.log('btn_plusTag is null')

function addTagToEntry() {
    //@ts-ignore
    updateFile()//from update.ts
}