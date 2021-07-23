import { ipcRenderer } from "electron"


var title = document.querySelector('#entry-title') as HTMLDivElement
var body = document.querySelector('#entry-body') as HTMLDivElement



async function displayEntry() {
    var entryJson:string = await ipcRenderer.invoke('get-last-entry')
    var entry:Entry = JSON.parse(entryJson)
    title.innerHTML = entry.title
    body.innerHTML = entry.body
}
