import { ipcRenderer } from "electron"

var btn_tags = document.querySelector('#btn-tags') as HTMLDivElement
var btn_edit_tags = document.querySelector('#btn-edit-tags') as HTMLDivElement
var btn_add_entry = document.querySelector('#btn-add-entry') as HTMLDivElement
var btn_settings = document.querySelector('#btn-settings') as HTMLDivElement

var side_panel = document.querySelector('#side-panel') as HTMLDivElement
var loading = document.querySelector('#loader') as HTMLDivElement

btn_tags ? btn_tags.onclick = () => clickBtnTags() : console.log('btn_tags is null')

function clickBtnTags() {
    toggleSidePanel()
}
var hidden = true
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
        loadTags()
        loadEntries()
    }
}

btn_add_entry ? btn_add_entry.onclick = () => clickBtnAddEntry() : console.log('btn_add_entry is null')
function clickBtnAddEntry() {
    //open create entry view
    ipcRenderer.invoke('create-entry-view')
}

btn_edit_tags ? btn_edit_tags.onclick = () => clickBtnEditTags() : console.log('btn_edit_tags is null')
function clickBtnEditTags() {
    //open edit tags view
    ipcRenderer.invoke('edit-tags')
}


btn_settings ?  btn_settings.onclick = () => clickBtnSettings() : console.log('btn_settings is null')
function clickBtnSettings() {
    //open settings view
    ipcRenderer.invoke('settings-view')
}

var tags = document.querySelector('#tags') as HTMLDivElement
var entries = document.querySelector('#entries') as HTMLDivElement
function loadTags() {
    console.log('loadTags called')
    loading.className = 'loader'
    ipcRenderer.send('list-all-tags-html')
}

ipcRenderer.on('recieve-list-all-tags-html', (event, html) => {
    tags.innerHTML = html
    console.log('html:',html)
})

function loadEntries() {
    console.log('loadEntries called')
    loading.className = 'loader'
    ipcRenderer.send('list-all-entries-html')
    
}


ipcRenderer.on('recieve-list-all-entries-html', (event,html) => {
    entries.innerHTML = html
    console.log('html:',html)
    loading.className = ''
})


window.onload = async() => {
}