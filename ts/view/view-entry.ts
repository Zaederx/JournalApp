import { ipcRenderer } from "electron"
//@ts-ignore
// import { Entry } from '../classes/entry'
var messageDiv = document.querySelector('#message') as HTMLDivElement
var title = document.querySelector('#entry-title') as HTMLDivElement

var body = document.querySelector('#entry-body') as HTMLDivElement
var tags = document.querySelector('#entry-tags') as HTMLDivElement
var btn_edit_entry = document.querySelector('#edit-entry') as HTMLDivElement
var btn_delete_entry = document.querySelector('#delete-entry') as HTMLDivElement


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
    var tagsHTML = e.tagsToHTML(entry.tags)
    console.log('tagsHTML:',tagsHTML)
    tags.innerHTML = tagsHTML
}

btn_edit_entry ? btn_edit_entry.onclick = () => editEntryView() : console.log('btn_edit_entry is null')
function editEntryView() {
    //open edit view
    ipcRenderer.invoke('edit-entry-view')
}

btn_delete_entry ? btn_delete_entry.onclick = () => deleteCurrentEntry() : console.log('btn_delete_entry is null')

async function deleteCurrentEntry() {
    var message = await ipcRenderer.invoke('delete-current-entry')
    messageDiv.innerText = message
}
// //collect all tags added
// var eTags:any[] = []
// tags.childNodes.forEach((tag) => { eTags.push((tag as HTMLDivElement).innerHTML)})
// //get entry title, body and tags
// var entry = new Entry(title.innerText,body.innerText,eTags)