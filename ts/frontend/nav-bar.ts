const btn_tags = document.querySelector('#btn-tags') as HTMLDivElement
const btn_edit_tags = document.querySelector('#btn-edit-tags') as HTMLDivElement
const btn_add_entry = document.querySelector(addEntryViewId) as HTMLDivElement
const btn_settings = document.querySelector('#btn-settings') as HTMLDivElement

btn_tags ? btn_tags.onclick = () => clickFolderBtn() : console.log('btn_tags is null')

btn_edit_tags ? btn_edit_tags.onclick = () => clickPlusFolderBtn() : console.log('btn_edit_tags is null')

btn_add_entry ? btn_add_entry.onclick = () => {displayNEView(); hideSidePanel() /*see create.ts for functions*/} : console.log('btn_add_entry is null')
btn_settings ? btn_settings.onclick = () => {} : console.log('btn_settings is null')

//Buttons highlight on hover
btnHighlighting(btn_tags)
btnHighlighting(btn_edit_tags)
btnHighlighting(btn_add_entry)
btnHighlighting(btn_settings)

var visible = false
/**
 * Toggles side panel off and on
 */
function toggleSidePanel() {
    console.log('toggleSidePanel called')
    if (visible == false) {
        displaySidePanel()
        refresh()
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
    hidePopUpTable()//hide manage tag popUpTable
    hideManageTagView()
}

function btnHighlighting(btn:HTMLDivElement) {
    btn.onmouseover = () => {btn.style.backgroundColor = btnHighlightRGB}
    btn.onmouseout = () => {btn.style.backgroundColor = ''}
}

var table = document.querySelector('#manage-tags')

function clickPlusFolderBtn() {
    //toggle manage tags view
    toggleManageTagView()

    // load tags into popUpTable
    loadTagTable()

    //hide side panel
    hideSidePanel()
}

var manageTagViewVisible = false
function displayManageTagView() {
    var view = document.querySelector('#manage-tags-view') as HTMLDivElement
    view.style.display = 'block'//TODO as grid maybe?
    manageTagViewVisible = true
    var table = document.querySelector('#manage-tag-table-body') as HTMLTableElement
    loadTagTable(table)
}

function hideManageTagView() {
    var view = document.querySelector('#manage-tags-view') as HTMLDivElement
    view.style.display = ''
    manageTagViewVisible = false
}


function toggleManageTagView() {
    if (manageTagViewVisible) {
        hideManageTagView()
    }
    else {
        displayManageTagView()
    }
}

