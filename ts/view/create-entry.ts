import clickCreateEntryBtn from './create-entry/clickCreateEntryBtn'
import toggleTagPopup from "./create-entry/tagPopup";
import { addSelectedTagsToEntry, removeSelectedTags } from "./clickable-filter-table/table";
import Entry from "../classes/entry"


console.log('create-entry.js onload called...')
const title = document.querySelector('#entry-title') as HTMLDivElement
const body = document.querySelector('#entry-body') as HTMLDivElement
const tags = document.querySelector('#entry-tags') as HTMLDivElement
//Temp

/** Create and Add Tgas buttons */
const btn_create_entry = document.querySelector('#create-entry') as HTMLDivElement
//for the 'Add Tags' btn
const btn_open_tags_popup = document.querySelector('#btn-add-tags') as HTMLDivElement

//enable create entry button
btn_create_entry ? btn_create_entry.onclick = () =>  clickCreateEntryBtn(title, body, tags) : console.log('btn_create_entry is null');


//SECTION - TagsPopup
var promise = loadTagsPopup()
//all DOM manipulation needs to happen after loading fragments
//(just to make sure that the full page is rendered before accessing anything)
promise.then(() => {
    console.log('entering then code block...')
    
    btn_open_tags_popup ? btn_open_tags_popup.onclick = () => toggleTagPopup(main, tagTableBody3) : console.log('btn_open_tags_popup is null')
    /** Tags popup  */
    const btn_add_tags = document.querySelector('#add-selected-tags') as HTMLDivElement
    var btn_remove_tags = document.querySelector('#remove-selected-tags') as HTMLDivElement
    const btn_close = document.querySelector('#close-btn') as HTMLDivElement
    //main container - to be blurred when popup is displayed
    const main = document.querySelector('#main') as HTMLDivElement

    //Fetch tablebody element
    const tagTableBody3 = document.querySelector('#tag-table-body') as HTMLTableElement

    //Enable buttons
    btn_add_tags ? btn_add_tags.onclick = () => addSelectedTagsToEntry(tags, tagTableBody3) : console.log('add_tags btn is null')
    btn_remove_tags ? btn_remove_tags.onclick = () => removeSelectedTags(tagTableBody3, title, body, tags) : console.warn('btn_remove_tags is null')
    btn_close ? btn_close.onclick = () => toggleTagPopup(main, tagTableBody3) : console.warn('popup close_btn is null')
})




async function loadTagsPopup()
{
    console.log('loadTagsPopup called...')
    //load tags popup
    const tags_popup = await (await fetch('./fragments/tags-popup.html')).text()
    document.querySelector('#tags-popup')!.outerHTML = tags_popup
}
 

 
 