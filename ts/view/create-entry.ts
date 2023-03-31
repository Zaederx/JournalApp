import clickCreateEntryBtn from './create-entry/clickCreateEntryBtn'
import toggleTagPopup from "./create-entry/tagPopup";
import { addSelectedTagsToEntry } from "./clickable-filter-table/table";
import Entry from "../classes/entry"

window.onload = () => {
    
    var promise = loadFragments()
    //all DOM manipulation needs to happen after loading fragments
    //(just to make sure that the full page is rendered before accessing anything)
    promise.then(() => {
        const btn_open_tags_popup = document.querySelector('#btn-add-tags') as HTMLDivElement
        btn_open_tags_popup ? btn_open_tags_popup.onclick = () => toggleTagPopup(main, tagTableBody3) : console.log('btn_open_tags_popup is null')
        //is there need for a reminder
        // ipcRenderer.send('password-reminder-?')
    })
}




const title = document.querySelector('#entry-title') as HTMLDivElement
const body = document.querySelector('#entry-body') as HTMLDivElement
const tags = document.querySelector('#entry-tags') as HTMLDivElement
//Temp
var entryTemp:Entry = new Entry({})
/** Create and Add Tgas buttons */
const btn_create_entry = document.querySelector('#create-entry') as HTMLDivElement

//enable create entry button
btn_create_entry ? btn_create_entry.onclick = () =>  clickCreateEntryBtn(entryTemp, title, body, tags) : console.log('btn_create_entry is null');


/** Tags popup  */
const btn_add_tags = document.querySelector('#add-selected-tags') as HTMLDivElement
const btn_close = document.querySelector('#close-btn') as HTMLDivElement
//main container - to be blurred when pop is displayed
const main = document.querySelector('#main') as HTMLDivElement

//Fetch tablebody element
const tagTableBody3 = document.querySelector('#tag-table-body') as HTMLTableElement

//Enable buttons
btn_add_tags ? btn_add_tags.onclick = () => addSelectedTagsToEntry(entryTemp,tags, tagTableBody3) : console.log('add_tags btn is null')

btn_close ? btn_close.onclick = () => toggleTagPopup(main, tagTableBody3) : console.warn('popup close_btn is null')


async function loadFragments()
{
    //load tags popup
    const tags_popup = await (await fetch('./fragments/tags-popup.html')).text()
    document.querySelector('#tags-popup')!.outerHTML = tags_popup
    //load password dialog - fetching it from files
    const authDialog = await (await fetch('./fragments/authentication-dialog.html')).text()
    document.querySelector('#auth-dialog')!.outerHTML = authDialog
}
 

 
 