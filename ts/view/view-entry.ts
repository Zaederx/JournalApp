import { ipcRenderer } from "electron"


var title = document.querySelector('#entry-title') as HTMLDivElement
var body = document.querySelector('#entry-body') as HTMLDivElement



async function displayLastEntry() {
    var entryJson:string = await ipcRenderer.invoke('get-last-entry')
    var entry:Entry = JSON.parse(entryJson)
    title.innerHTML = entry.title
    body.innerHTML = entry.body
}


window.onload = () => displayLastEntry()

function displaySelectedEntry() {
    
}