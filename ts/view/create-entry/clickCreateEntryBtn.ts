import { ipcRenderer } from "electron"
export default async function clickCreateEntryBtn(entryTemp:any, title:HTMLDivElement, body:HTMLDivElement, messageDiv:HTMLDivElement) {
    //get entry text & put in entry object
    var dateStr = await ipcRenderer.invoke('get-datestr')
    entryTemp.date = dateStr
    entryTemp.title = title.innerHTML
    entryTemp.body = body.innerHTML
    //send to backend to be persisted
    var entry_json = JSON.stringify(entryTemp);
    var message:string = await ipcRenderer.invoke('create-entry', entry_json);
    messageDiv.innerText = message
    console.log('create entry message:',message);
}