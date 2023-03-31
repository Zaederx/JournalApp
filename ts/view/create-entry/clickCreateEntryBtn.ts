import { ipcRenderer } from "electron"
import Entry from "../../classes/entry"

export default async function clickCreateEntryBtn(entryTemp:Entry, title:HTMLDivElement, body:HTMLDivElement, tags:HTMLDivElement) {
    console.log('function clickCreateEntryBtn called')
    var e = new Entry({})
    //get entry text & put in entry object
    var dateStr = await ipcRenderer.invoke('get-datestr')
    entryTemp.udate = dateStr
    entryTemp.title = title.innerHTML
    entryTemp.body = body.innerHTML
    //add tags
    var tagNames:string[] = []
    for(var i=0; i < tags.children.length; i++) {
        const tag = tags.children[i].textContent
        if(tag != '')
        {
            tagNames.push(tag as string)
            console.log('tag "'+ tag +'" added')
        }
    }
    tags.childNodes.forEach( div => {
        
        

    })
    entryTemp.tags = tagNames
    //send to backend to be persisted
    var entry_json = JSON.stringify(entryTemp);
    var message:string = await ipcRenderer.invoke('create-entry', entry_json);
    alert(message)
    console.log('create entry message:',message);
}