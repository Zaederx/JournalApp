import { ipcRenderer } from "electron"
import { deactivateLoader } from "./nav/loader"
import { makeAllEntriesClickable, makeAllTagsClickable, makeTagDivClickable } from "./nav/clickable"
import loadEntries from "./nav/load-entries"
import EventEmitter from "events"

const panel_tags = document.querySelector('#tags') as HTMLDivElement
const panel_entries = document.querySelector('#entries') as HTMLDivElement

if (document.querySelector('#btn-tags'))
{
    var btn_tags = document.querySelector('#btn-tags') as HTMLDivElement
    btn_tags ? btn_tags.onclick = () => clickBtnTags() : console.log('btn_tags is null')
}
if (document.querySelector('#btn-edit-tags'))
{
    var btn_edit_tags = document.querySelector('#btn-edit-tags') as HTMLDivElement
    btn_edit_tags ? btn_edit_tags.onclick = () => clickBtnEditTags() : console.log('btn_edit_tags is null')
}
if (document.querySelector('#btn-add-entry'))
{
    var btn_export = document.querySelector('#btn-add-entry') as HTMLDivElement
    btn_export ? btn_export.onclick = () => clickBtnAddEntry() : console.log('btn_add_entry is null')
}

if(document.querySelector('#btn-export'))
{
    var btn_export = document.querySelector('#btn-export') as HTMLDivElement
    btn_export ? btn_export.onclick = () => clickBtnExportEntries() : console.log('btn_add_entry is null')
}

if (document.querySelector('#btn-settings'))
{
    var btn_settings = document.querySelector('#btn-settings') as HTMLDivElement
    btn_settings ?  btn_settings.onclick = () => clickBtnSettings() : console.log('btn_settings is null')
}

if (document.querySelector('#side-panel'))
{
    var side_panel = document.querySelector('#side-panel') as HTMLDivElement
}

if (document.querySelector('#loader'))
{
    var loader = document.querySelector('#loader') as HTMLDivElement
}




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
        // loadTags()
        // loadEntries(loader, panel_entries)
    }
}

/** Click button functions - ipcRenderer invoking end */
function clickBtnAddEntry() {
    //open create entry view
    ipcRenderer.invoke('create-entry-view')
}

function clickBtnEditTags() {
    //open edit tags view
    ipcRenderer.invoke('edit-tags')
}

function clickBtnExportEntries() {
    ipcRenderer.invoke('export-entries')
}

function clickBtnSettings() {
    //open settings view
    ipcRenderer.invoke('settings-view')
}


function loadTags() {
    console.log('loadTags called')
    // activateLoader() - done by loadEntries()
    ipcRenderer.send('list-all-tags-html')
}




/************** ipcRenderer recieving end ************** *
 * Recieves the list of tags one at a time.
 * Loads those tags into the panel
 * and makes them clickable 
 */
ipcRenderer.on('recieve-entry-filename', async(event, entryFilename) => {
    console.log('recieve-entry-filename called')
    var entryDiv = document.createElement('div')
    entryDiv.innerHTML = entryFilename
    panel_entries.appendChild(entryDiv)
    console.log('html:',entryFilename)
    await makeTagDivClickable(entryDiv, loader, panel_entries)
})


/**
 * Recieve a list of all entries one at a time.
 */
ipcRenderer.on('recieve-tag-dirname', (event,dirName) => {
    console.log('recieve-tag-dirname called')
    var tagDiv = document.createElement('div')
    tagDiv.innerHTML = dirName
    panel_tags.appendChild(tagDiv)
    console.log('dirName:',dirName)
    deactivateLoader(loader)
})



// window.onload = () => {
//     loadEntries(loader)
//     loadTags()
// }
