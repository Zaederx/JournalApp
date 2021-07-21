import { ipcRenderer } from "electron"

var title = document.querySelector('#entry-title') as HTMLDivElement
var body = document.querySelector('#entry-body') as HTMLDivElement
var btn_create_entry = document.querySelector('#create-entry') as HTMLDivElement

btn_create_entry ? btn_create_entry.onclick = () => clickCreateEntryBtn(): console.log ('btn_create_entry is null')

function clickCreateEntryBtn() {
    //get entry text & put in entry object
    var entry = new Entry(title.innerText,body.innerText)
    //send to backend to be persisted
    var entry_json = JSON.stringify(entry)
    var message = ipcRenderer.invoke('create-entry', entry_json)
    console.log(message)
}