var btn_tags = document.querySelector('#btn-tags') as HTMLDivElement
var btn_edit_tags = document.querySelector('btn-edit-tags') as HTMLDivElement
var btn_add_entry = document.querySelector('#btn_add_entry') as HTMLDivElement
var btn_settings = document.querySelector('#btn-settings') as HTMLDivElement

var side_panel = document.querySelector('#side-panel') as HTMLDivElement

btn_tags ? btn_tags.onclick = () => toggleSidePanel() : console.log('btn_tags is null')

function clickBtnTags() {
    toggleSidePanel()

}
var hidden = false
function hideSidePanel() {
    side_panel.style.display = 'none'
    console.log('hideSidePanel called')
}

function displaySidePanel() {
    side_panel.style.display = 'grid'
    console.log('displaySidePanel called')
}

function toggleSidePanel() {
    console.log('toggle')
    if (!hidden) {
        hideSidePanel()
        hidden = true
    }
    else {
        displaySidePanel()
        hidden = false
    }
}

function clickBtnEditTags() {

}

function clickBtnAddEntry() {

}

function clickBtnSettings() {

}

