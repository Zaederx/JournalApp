import { ipcRenderer } from "electron"
import Entry from "../../classes/entry"

export default async function clickCreateEntryBtn(entryTemp:Entry, title:HTMLDivElement, body:HTMLDivElement, tags:HTMLDivElement) {
    console.log('function clickCreateEntryBtn called')
    var e = new Entry({})
    //get entry text & put in entry object
    var dateStr = await ipcRenderer.invoke('get-datestr')
    entryTemp.date = dateStr
    entryTemp.title = title.innerHTML
    entryTemp.body = body.innerHTML
    //add tags
    var tagNames:string[] = []
    tags.childNodes.forEach( div => {
        if(div.textContent != '')
        tagNames.push(div?.textContent as string)
    })
    entryTemp.tags = tagNames
    //send to backend to be persisted
    var entry_json = JSON.stringify(entryTemp);
    var message:string = await ipcRenderer.invoke('create-entry', entry_json);
    alert(message)
    console.log('create entry message:',message);
}