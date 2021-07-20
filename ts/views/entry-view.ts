
//Buttons
var btn_edit = document.querySelector('#edit-entry') as HTMLDivElement
var btn_delete = document.querySelector('#delete-entry') as HTMLDivElement

//Content
var title = document.querySelector('#entry-title') as HTMLDivElement
var body = document.querySelector('#entry-body') as HTMLDivElement



btn_edit ? btn_edit.onclick = () => clickEditBtn() : console.warn('btn_edit is null')

btn_delete ? btn_delete.onclick = () => clickDeleteBtn() : console.warn('btn_delete is null')

window.onload = () => displayLastEntry()

async function displayLastEntry() {
    var entry_json = await window.entryCRUD.getLastEntry()
    var entry:Entry = JSON.parse(entry_json)
    title.innerText = entry.title
    body.innerText = entry.body
}

function clickEditBtn() {
    //open edit view
   var message = window.view.editEntryView()
   console.log(message)
    
}

function clickDeleteBtn() {

}