import { ipcRenderer } from "electron"

const panel_tags = document.querySelector('#tags') as HTMLDivElement
var panel_entries = document.querySelector('#entries') as HTMLDivElement

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
    var loading = document.querySelector('#loader') as HTMLDivElement
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
        loadTags()
        loadEntries()
    }
}


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

ipcRenderer.on('recieve-list-all-tags-html', (event, html) => {
    panel_tags.innerHTML = html
    console.log('html:',html)
    makeAllTagsClickable()
    // deactivateLoader() - done by loadEntires() reciever
})

async function loadEntries() {
    console.log('loadEntries called')
    activateLoader()
    var html = await ipcRenderer.invoke('list-all-entries-html')
    panel_entries.innerHTML = html
    console.log('html:',html)
    makeAllEntriesClickable()
    deactivateLoader()
}


ipcRenderer.on('recieve-list-all-entries-html', (event,html) => {
    panel_entries.innerHTML = html
    console.log('html:',html)
    deactivateLoader()
})

function activateLoader() {
    loading.className = 'loader'
}

function deactivateLoader() {
    loading.className = ''
}


//Making tags clickable
function makeTagDivClickable(tagDiv:HTMLDivElement) {
    //when a tag is clicked
    tagDiv.onclick = async() => {
        //remove active tag class name from currentActiveTag
        var previousActive = document.querySelector('.active.tag') as HTMLDivElement
        previousActive.className = ''
        //make this tag currently active tag
        tagDiv.className = 'active tag'
        //get tagname
        var selectedTagName = tagDiv.innerText
        //activate loading spinner
        activateLoader()
        // fetch the tag's associated entries
        var entriesHTML = await ipcRenderer.invoke('get-tag-entries-html', selectedTagName)
        //display tag's associated entries
        panel_entries.innerHTML = entriesHTML
        //make entries clickable / open the entry view
        makeAllEntriesClickable()
        //remove loading spinner
        deactivateLoader()
    }
}


//make entries clickable / open entry view with this entry
function makeEntryDivClickable(entryDiv:HTMLDivElement) {
    //when entry is clicked
    entryDiv.onclick = () => {
        //get selected entry name
        var selectedEntryName = entryDiv.innerText
        //activate loading spinner
        activateLoader()
        //set current entry to be read as selected
        var entry = ipcRenderer.invoke('set-current-entry', selectedEntryName)
        //remove loading spinner
        deactivateLoader()
        //open the entry view
        ipcRenderer.invoke('entry-view')
    }
}

function makeAllTagsClickable() {
    var tags = document.querySelector('#tags') as HTMLDivElement
    console.warn('entries:',tags)
    tags.childNodes.forEach((tag)=> makeTagDivClickable(tag as HTMLDivElement))
}
//make all entries clickable
function makeAllEntriesClickable() {
    //get all entry divs
    var entries = document.querySelector('#entries') as HTMLDivElement
    console.warn('entries:',entries)
    entries.childNodes.forEach((entry)=> makeEntryDivClickable(entry as HTMLDivElement))
}