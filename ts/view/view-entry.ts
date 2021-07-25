import { ipcRenderer } from "electron"


var title = document.querySelector('#entry-title') as HTMLDivElement
var body = document.querySelector('#entry-body') as HTMLDivElement
var tags = document.querySelector('#entry-tags') as HTMLDivElement
var btn_edit_entry = document.querySelector('#edit-entry') as HTMLDivElement

async function displayLastEntry() {
    var entryJson:string = await ipcRenderer.invoke('get-last-entry')
    var entry:Entry = JSON.parse(entryJson)
    title.innerHTML = entry.title
    body.innerHTML = entry.body
}


window.onload = () => displaySelectedEntry()
var e = new Entry()
async function displaySelectedEntry() {
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

btn_edit_entry ? btn_edit_entry.onclick = () => editEntryView() : console.log('btn_edit_entry is null')
function editEntryView() {
    //open edit view
    ipcRenderer.invoke('edit-entry-view')
}

// //collect all tags added
// var eTags:any[] = []
// tags.childNodes.forEach((tag) => { eTags.push((tag as HTMLDivElement).innerHTML)})
// //get entry title, body and tags
// var entry = new Entry(title.innerText,body.innerText,eTags)