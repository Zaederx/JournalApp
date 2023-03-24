import { ipcRenderer } from "electron"
import displayCurrentEntry from "./display/displayCurrentEntry"

const messageDiv = document.querySelector('#message') as HTMLDivElement
const title = document.querySelector('#entry-title') as HTMLDivElement
const body = document.querySelector('#entry-body') as HTMLDivElement
const tags = document.querySelector('#entry-tags') as HTMLDivElement

const btn_edit_entry = document.querySelector('#edit-entry') as HTMLDivElement
const btn_delete_entry = document.querySelector('#delete-entry') as HTMLDivElement


window.onload = () => displayCurrentEntry(title,body,tags)
//@ts-ignore



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
    alert(message)
}