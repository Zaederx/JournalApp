import displayCurrentEntry from "./display/displayCurrentEntry"
import saveNewEntry from "./edit-entry/saveNewEntry"
import toggleTagPopup from "./create-entry/tagPopup"
import { addSelectedTagsToEntry, removeSelectedTags } from "./clickable-filter-table/table"
import Entry from "../classes/entry"
import updateEntry from "./edit-entry/updateEntry"

async function loadFragment()
{
    //load tags popup
    const tags_popup = await (await fetch('./fragments/tags-popup.html')).text()
    document.querySelector('#tags-popup')!.outerHTML = tags_popup
}
var promise = loadFragment()
//Fetch HTML Elements
const messageDiv = document.querySelector('#message') as HTMLDivElement
const title = document.querySelector('#entry-title') as HTMLDivElement
const body = document.querySelector('#entry-body') as HTMLDivElement
const tags = document.querySelector('#entry-tags') as HTMLDivElement
window.onload = () => displayCurrentEntry(title,body,tags)//window.onload must be outside of the promise to work - misses onload event firing otherwise
promise.then(() => {
//Div Buttons
const update_entry = document.querySelector('#update-entry') as HTMLDivElement
const save_new_entry = document.querySelector('#save-new-entry') as HTMLDivElement
const edit_entry_tags = document.querySelector('#edit-entry-tags') as HTMLDivElement

//Enable events
update_entry ? update_entry.onclick = () => updateEntry(title,body,tags) : console.log('update_entry is null')
save_new_entry ? save_new_entry.onclick = () => saveNewEntry(title,body,tags,messageDiv) : console.log('save_new_entry is null')
edit_entry_tags ? edit_entry_tags.onclick = () => toggleTagPopup(main,tagTableBody1) : console.log('edit_entry_tags is null')

//Functions
//@ts-ignore
var entryTemp = new Entry({})
window.onload = () => displayCurrentEntry(title,body,tags)


//******** Handling The Tag Pop ********** */
var btn_tags_popup = document.querySelector('#edit-tags-popup') as HTMLDivElement
var btn_add_tags = document.querySelector('#add-selected-tags') as HTMLDivElement
var btn_remove_tags = document.querySelector('#remove-selected-tags') as HTMLDivElement
var main = document.querySelector('#main-container') as HTMLDivElement
var close_btn = document.querySelector('#close-btn') as HTMLDivElement


var tagTableBody1 = document.querySelector('#tag-table-body') as HTMLTableElement

btn_tags_popup ? btn_tags_popup.onclick = () => toggleTagPopup(main,tagTableBody1) : console.log('btn_tags_popup is null')

btn_add_tags ? btn_add_tags.onclick = () => addSelectedTagsToEntry(tags, tagTableBody1) : console.log('add_tags btn is null')

btn_remove_tags ? btn_remove_tags.onclick = () => removeSelectedTags(tagTableBody1, title, body, tags) : console.warn('btn_remove_tags is null')

close_btn ? close_btn.onclick = () => toggleTagPopup(main,tagTableBody1) : console.warn('popup close_btn is null')
})
