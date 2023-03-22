import { ipcRenderer } from "electron"
import { activateLoader, deactivateLoader } from "./loader"

/**
 * 
 * @param tagDiv the tag div to be make clickable
 * @param loader the loader that is activated and deactivated at the start and end of the function
 * @param panel_entries panel_entries 
 */
export function makeTagDivClickable(tagDiv:HTMLDivElement, loader:HTMLDivElement):Promise<string> {
    //when a tag is clicked
    return new Promise((resolve,reject) => {
        try {
            tagDiv.onclick = (async() => {
                //activate loading spinner
                activateLoader(loader)
                //remove active tag class name from currentActiveTag
                var previousActive = document.querySelector('.active.tag') as HTMLDivElement
                previousActive.className = ' '
                //make this tag currently active tag
                tagDiv.className = 'active tag'
                //get tagname
                var selectedTagName = tagDiv.innerText
                // fetch the tag's associated entries
                await ipcRenderer.send('get-tag-entries', selectedTagName)
                // //display tag's associated entries
                // panel_entries.innerHTML = entriesHTML
                //make entries clickable / open the entry view
                // makeAllEntriesClickable(loader)
                //remove loading spinner
                deactivateLoader(loader)
            })
            const message = 'makeTagDivClickable successful'
            resolve(message)
        } catch (error) {
            reject(error)
        }
    })
}


//make entries clickable / open entry view with this entry
export function makeEntryDivClickable(entryDiv:HTMLDivElement, loader:HTMLDivElement):Promise<string> {
    
    return new Promise((resolve,reject) => {
        try {
            //when entry is clicked
            entryDiv.onclick = () => {
                //activate loading spinner
                activateLoader(loader)
                //get selected entry name
                var selectedEntryName = entryDiv.innerText
                //set current entry to be read as selected
                ipcRenderer.invoke('set-current-entry', selectedEntryName)
                //open the entry view
                ipcRenderer.invoke('entry-view')
                //remove loading spinner
                deactivateLoader(loader)
            }
            const message = 'makeEntryDivClickable successful'
            resolve(message)
        } 
        catch (error) {
            reject(error)
        }
        
    })
}
export function makeAllTagsClickable(loader:HTMLDivElement):Promise<string> {
    

    return new Promise((resolve, reject) => {
        try {
            var tags = document.querySelector('#tags') as HTMLDivElement
            console.warn('entries:',tags)
            tags.childNodes.forEach((tag) => makeTagDivClickable(tag as HTMLDivElement,loader))
            const message = ''
            resolve(message)
        } catch (error) {
            reject(error)
        }
    }) 
}

//make all entries clickable
export function makeAllEntriesClickable(loader:HTMLDivElement):Promise<string> {
    return new Promise((resolve,reject) => {
        try {
            //get all entry divs
            var entries = document.querySelector('#entries') as HTMLDivElement
            console.warn('entries:',entries)
            entries.childNodes.forEach((entry) => makeEntryDivClickable(entry as HTMLDivElement,loader))
            const message = 'makeAllEntriesClickable successful'
            resolve(message)
        } catch (error) {
            reject(error)
        }
    })
    
}