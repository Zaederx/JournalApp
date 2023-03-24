import { ipcRenderer } from "electron"
import { activateLoader, deactivateLoader } from "./nav/loader"
import { makeTagDivClickable, makeEntryDivClickable } from "./nav/clickable"

//  Load html fragments
async function loadFragments()
{
    console.log('function loadFragments called')
    //load navigation
    const navigation = await (await fetch('./fragments/nav.html')).text()
    document.querySelector('#nav')!.outerHTML = navigation

    //load side panel
    const side_panel = await (await fetch('./fragments/tags-entries-sidepanel.html')).text()
    document.querySelector('#side-panel')!.outerHTML = side_panel

    //load tags popup
    const tags_popup = await (await fetch('./fragments/tags-popup.html')).text()
    document.querySelector('#tags-popup')!.outerHTML = tags_popup
}
var promise = loadFragments()

//MUST USE PROMISE TO GET BUTTONS AND ACTIVATE AFTER DYNAMIC LOADING OF NAVIGATION
promise.then(() => {
    const panel_tags = document.querySelector('#tags') as HTMLDivElement
    const panel_entries = document.querySelector('#entries') as HTMLDivElement
    var btn_tags = document.querySelector('#btn-tags') as HTMLDivElement
    var btn_edit_tags = document.querySelector('#btn-edit-tags') as HTMLDivElement
    var btn_add_entry = document.querySelector('#btn-add-entry') as HTMLDivElement
    var btn_export = document.querySelector('#btn-export') as HTMLDivElement
    var btn_settings = document.querySelector('#btn-settings') as HTMLDivElement
    var side_panel = document.querySelector('#side-panel') as HTMLDivElement
    var loader = document.querySelector('#loader') as HTMLDivElement
    //ENABLE BUTTONS
    btn_tags ? btn_tags.onclick = () => clickBtnTags() : console.log('btn_tags is null')
    btn_edit_tags ? btn_edit_tags.onclick = () => clickBtnEditTags() : console.log('btn_edit_tags is null')
    btn_add_entry ? btn_add_entry.onclick = () => clickBtnAddEntry() : console.log('btn_add_entry is null')
    btn_export ? btn_export.onclick = () => clickBtnExportEntries() : console.log('btn_add_entry is null')
    btn_settings ?  btn_settings.onclick = () => clickBtnSettings() : console.log('btn_settings is null')
    
    function clickBtnTags() {
        toggleSidePanel()
        loadTags(panel_entries, panel_tags)
    }
    var hidden = true
    function hideSidePanel(side_panel:HTMLDivElement) {
        side_panel.style.display = 'none'
        console.log('hideSidePanel called')
    }
    
    function displaySidePanel(side_panel:HTMLDivElement) {
        side_panel.style.display = 'grid'
        console.log('displaySidePanel called')
    }
    
    function toggleSidePanel() {
        console.log('toggle')
        if (!hidden) {
            hideSidePanel(side_panel)
            hidden = true
        }
        else {
            displaySidePanel(side_panel)
            hidden = false
        }
    }
})


















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

const clear = ''
var tagCount = 0
var entryCount = 0
function loadTags(panel_entries:HTMLDivElement, panel_tags:HTMLDivElement) {
    console.log('loadTags called')
    //reset panels
    panel_entries.innerHTML = clear//ENTRIES
    panel_tags.innerHTML = clear//TAGS
    //reset count
    tagCount = 0
    entryCount = 0
    ipcRenderer.send('ready-to-show')
}




/************** ipcRenderer recieving end ************** *
 * Recieves the list of tags one at a time.
 * Loads those tags into the panel
 * and makes them clickable 
 */
ipcRenderer.on('recieve-entry-filename', async(event, message) => {
    console.log('recieve-entry-filename called')
    var { firstEntry, entryFilename } = message
    const panel_entries = document.querySelector('#entries')
    const loader = document.querySelector('#loader') as HTMLDivElement
    //clear panel entries
    if(firstEntry && panel_entries)
    {
        panel_entries.innerHTML = clear//entries
    }
    //loader
    activateLoader(loader)
    //create entry div
    var entryDiv = document.createElement('div')
    if (entryFilename != undefined)
    {
        entryDiv.innerHTML = entryFilename
        panel_entries?.appendChild(entryDiv)
        console.log('entryFilename:', entryFilename)
        //make entry div clcickable
        await makeEntryDivClickable(entryDiv, loader)
    }
    
    //loader
    deactivateLoader(loader)
})


const firstTag = true
/**
 * Recieve a list of all entries one at a time.
 * Note: clearTags is always true for the first tag
 */
ipcRenderer.on('recieve-tag-dirname', async (event,message) => {
    console.log('recieve-tag-dirname called')
    const panel_tags = document.querySelector('#tags')
    const loader = document.querySelector('#loader') as HTMLDivElement
    //clear panel tags on first tag
    if(message.firstTag && panel_tags)
    {
        panel_tags.innerHTML = clear//tags
    }
    activateLoader(loader)
    var tagDiv = document.createElement('div')
    tagDiv.innerHTML = message.tagDirname
    //if first tag
    if (message.firstTag) {
        console.log('active tag set')
        tagDiv.className = 'active tag'
        console.log(tagDiv.className)
    }
    tagCount++
    panel_tags?.appendChild(tagDiv)
    console.log('dirName:',message.tagDirname)
    await makeTagDivClickable(tagDiv, loader)
    deactivateLoader(loader)
})

ipcRenderer.on('recieve-tag-entries', async (event, message) => {
    console.log('recieve-tag-entries called')
    const panel_entries = document.querySelector('#entries')
    const loader = document.querySelector('#loader') as HTMLDivElement
    var { firstEntry, entryFilename } = message
    //clear panel entries
    if(firstEntry && panel_entries)
    {
        panel_entries.innerHTML = clear//entries
    }
    //loader
    activateLoader(loader)
    //create entry div
    if (entryFilename != undefined)
    {
        var entryDiv = document.createElement('div')
        entryDiv.innerHTML = entryFilename
        panel_entries?.appendChild(entryDiv)
        console.log('entryFilename:', entryFilename)
        //make entry div clcickable
        await makeEntryDivClickable(entryDiv, loader)
    }
    
    
    deactivateLoader(loader)
})

ipcRenderer.on('activate-loader', () => {
    const loader = document.querySelector('#loader') as HTMLDivElement
    activateLoader(loader)
})

ipcRenderer.on('deactivate-loader', () => {
    const loader = document.querySelector('#loader') as HTMLDivElement
    deactivateLoader(loader)
})

// window.onload = () => {
//     loadEntries(loader)
//     loadTags()
// }
