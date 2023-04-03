import { ipcRenderer } from "electron"
import Entry from "../../classes/entry"

export default async function clickCreateEntryBtn( title:HTMLDivElement, body:HTMLDivElement, tags:HTMLDivElement) {
    console.log('function clickCreateEntryBtn called')
    
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
    var e = new Entry({})
    e.title = title.innerHTML
    e.body = body.innerHTML
    e.tags = tagNames
    //send to backend to be persisted
    var entry_json = JSON.stringify(e);
    var message:string = await ipcRenderer.invoke('create-entry', entry_json);
    alert(message)
    console.log('create entry message:',message);
}