const btn_tags = document.querySelector('#btn-tags') as HTMLDivElement
const btn_entries = document.querySelector('#btn-entries') as HTMLDivElement
const btn_add_entry = document.querySelector(addEntryViewId) as HTMLDivElement
const btn_settings = document.querySelector('#btn-settings') as HTMLDivElement

btn_tags ? btn_tags.onclick = () => clickFolderBtn() : console.log('btn_tags is null')
// btn_entries ? btn_entries.onclick = () => {} : console.log('btn_entries is null')
btn_add_entry ? btn_add_entry.onclick = () => {displayNEView(); hideSidePanel() /*see create.ts for functions*/} : console.log('btn_add_entry is null')
btn_settings ? btn_settings.onclick = () => {} : console.log('btn_settings is null')



var visible = false
/**
 * Toggles side panel off and on
 */
function toggleSidePanel() {
    console.log('toggleSidePanel called')
    if (visible == false) {
        displaySidePanel()
    }
    else {
        hideSidePanel()
    }
    console.log('sidepanel is visible?:', visible)
}

var sidePanel = document.querySelector('#side-panel') as HTMLDivElement
function displaySidePanel() {
    console.log('displaySidePanel called')
    sidePanel.style.display = 'grid'
    visible = true
}

function hideSidePanel() {
    console.log('hideSidePanel called')
    sidePanel.style.display = 'none'
    visible = false
}

function highlightBtn(btnDiv:HTMLDivElement) {
    console.log('*** highlightBtn called ***')
    btnDiv.className = 'btn-div-highlighted'
}

function unHighlightBtn(btnDiv:HTMLDivElement) {
    console.log('*** unHighlightBtn called ***')
    btnDiv.className = 'btn-div'
}

function clickFolderBtn() {
    console.log('*** clickTagsBtn called ***')
    toggleSidePanel()
}