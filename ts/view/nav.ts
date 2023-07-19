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
}

var promise = loadFragments()

//MUST USE PROMISE TO GET BUTTONS AND ACTIVATE AFTER DYNAMIC LOADING OF NAVIGATION
promise.then(() => {
    console.log("ipcRenderer.send('enable-navigation-?') called")
    ipcRenderer.send('enable-navigation-?')
})


ipcRenderer.on('enable-navigation', () => {
    const panel_tags = document.querySelector('#tags') as HTMLDivElement
    const panel_entries = document.querySelector('#entries') as HTMLDivElement
    var btn_tags = document.querySelector('#btn-tags') as HTMLDivElement
    var btn_edit_tags = document.querySelector('#btn-edit-tags') as HTMLDivElement
    var btn_add_entry = document.querySelector('#btn-add-entry') as HTMLDivElement
    var btn_export = document.querySelector('#btn-export') as HTMLDivElement
    var btn_settings = document.querySelector('#btn-settings') as HTMLDivElement
    var side_panel = document.querySelector('#side-panel') as HTMLDivElement
    // var loader = document.querySelector('#loader') as HTMLDivElement
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

function loadTags(panel_entries:HTMLDivElement, panel_tags:HTMLDivElement) {
    console.log('loadTags called')
    //reset panels
    panel_entries.innerHTML = clear//ENTRIES
    panel_tags.innerHTML = clear//TAGS
    //reset count
    ipcRenderer.send('ready-to-show-sidepanel')
}




/************** ipcRenderer recieving end ************** *
 * Recieves the list of tags one at a time.
 * Loads those tags into the panel
 * and makes them clickable 
 */


/**
 * Recieve a list of all entries one at a time.
 * Note: clearTags is always true for the first tag
 */
ipcRenderer.on('recieve-tag-dirname', async (event,message) => {
    console.log('recieve-tag-dirname called')
    const loader = document.querySelector('#loader') as HTMLDivElement
    // activateLoader(loader)
    const { firstTag, tagDirname, allTag } = message
    const panel_tags = document.querySelector('#tags')
    //clear panel tags on first tag
    if(firstTag && panel_tags)
    {
        panel_tags.innerHTML = clear//tags
    }
    var tagDiv = document.createElement('div')
    tagDiv.innerHTML = tagDirname
    //if first tag
    if (allTag) {
        console.log('active tag set')
        tagDiv.className = 'active tag'
        console.log(tagDiv.className)
    }
    panel_tags?.appendChild(tagDiv)
    console.log('dirName:', tagDirname)
    await makeTagDivClickable(tagDiv, loader)
    //loader
    // deactivateLoader(loader)
})

ipcRenderer.on('recieve-tag-entries', async (event, message) => {
    console.log('recieve-tag-entries called')
    //activate loader
    const loader = document.querySelector('#loader') as HTMLDivElement
    // activateLoader(loader)

    //get panel for tag entries
    const panel_entries = document.querySelector('#entries')
    var { firstEntry, entryFilename } = message
    //clear panel entries
    if(firstEntry && panel_entries)
    {
        panel_entries.innerHTML = clear//entries
    }
    //create entry div
    if (entryFilename != undefined && entryFilename != 'NO-ENTRIES')
    {
        var entryDiv = document.createElement('div')
        entryDiv.innerHTML = entryFilename
        panel_entries?.appendChild(entryDiv)
        console.log('entryFilename:', entryFilename)
        //make entry div clcickable
        var clickableSuccess = await makeEntryDivClickable(entryDiv, loader)
        console.log(clickableSuccess)
    }
    
    
    // deactivateLoader(loader)
})

ipcRenderer.on('activate-loader', () => {
    const loader = document.querySelector('#loader') as HTMLDivElement
    activateLoader(loader)
})

ipcRenderer.on('deactivate-loader', () => {
    const loader = document.querySelector('#loader') as HTMLDivElement
    deactivateLoader(loader)
})

