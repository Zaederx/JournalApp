import { ipcRenderer } from "electron"

var title = document.querySelector('#entry-title') as HTMLDivElement
var body = document.querySelector('#entry-body') as HTMLDivElement
var tags = document.querySelector('#entry-tags') as HTMLDivElement
window.onload = () => displayCurrentEntry()

var e = new Entry()
window.onload = () => displayCurrentEntry()
//display entry
async function displayCurrentEntry() {
    console.log('displaySelectedEntry called')
    var entryJson:string = await ipcRenderer.invoke('get-current-entry')
    console.log('entryJson:',entryJson)
    var entry:Entry = JSON.parse(entryJson)
    title.innerHTML = entry.title
    body.innerHTML = entry.body
    var tagsHTML = e.tagsToHTML(entry.tags)
    console.log('tagsHTML:',tagsHTML)
    tags.innerHTML = tagsHTML
}