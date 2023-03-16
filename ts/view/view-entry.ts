import { ipcRenderer } from "electron"
import Entry from '../classes/entry'

const messageDiv = document.querySelector('#message') as HTMLDivElement
const title = document.querySelector('#entry-title') as HTMLDivElement
const body = document.querySelector('#entry-body') as HTMLDivElement
const tags = document.querySelector('#entry-tags') as HTMLDivElement
const btn_edit_entry = document.querySelector('#edit-entry') as HTMLDivElement
const btn_delete_entry = document.querySelector('#delete-entry') as HTMLDivElement


window.onload = () => displaySelectedEntry()
//@ts-ignore

var e = new Entry({})
async function displaySelectedEntry() {
    console.log('displaySelectedEntry called')
    var entryJson:string = await ipcRenderer.invoke('get-current-entry')
    console.log('entryJson:',entryJson)
    //@ts-ignore
    var entry:Entry = JSON.parse(entryJson)
    title.innerHTML = entry.title
    body.innerHTML = entry.body
    console.log('view-entry.ts - displaySelectedEntry:entry.tags'+entry.tags)
    var tagsHTML = e.tagsToHTML(entry.tags)
    console.log('tagsHTML:',tagsHTML)
    tags.innerHTML = tagsHTML
}

btn_edit_entry ? btn_edit_entry.onclick = () => editEntryView() : console.log('btn_edit_entry is null')
function editEntryView() {
    console.log('function editEntryView called')
    //open edit view
    ipcRenderer.invoke('edit-entry-view')
}

btn_delete_entry ? btn_delete_entry.onclick = () => deleteCurrentEntry() : console.log('btn_delete_entry is null')

async function deleteCurrentEntry() {
    console.info('function deleteCurrentEntry called')
    var message = await ipcRenderer.invoke('delete-current-entry')
    messageDiv.innerText = message
}