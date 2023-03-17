import { ipcRenderer } from "electron"

import tagsToArr from "./edit-entry/tags-to-array"
import displayCurrentEntry from "./display/displayCurrentEntry"
import saveNewEntry from "./edit-entry/saveNewEntry"
import toggleTagPopup from "./create-entry/tagPopup"
import { addSelectedTagsToEntry, removeSelectedTags } from "./clickable-filter-table/table"
import Entry from "../classes/entry"
import updateEntry from "./edit-entry/updateEntry"

//Fetch HTML Elements
const messageDiv = document.querySelector('#message') as HTMLDivElement
const title = document.querySelector('#entry-title') as HTMLDivElement
const body = document.querySelector('#entry-body') as HTMLDivElement
const tags = document.querySelector('#entry-tags') as HTMLDivElement

//Div Buttons
const update_entry = document.querySelector('#update-entry') as HTMLDivElement
const save_new_entry = document.querySelector('#save-new-entry') as HTMLDivElement
const edit_entry_tags = document.querySelector('#edit-entry-tags') as HTMLDivElement

//Enable events
window.onload = () => displayCurrentEntry(title,body,tags)
update_entry ? update_entry.onclick = () => updateEntry(tags,messageDiv) : console.log('update_entry is null')
save_new_entry ? save_new_entry.onclick = () => saveNewEntry(tags,messageDiv) : console.log('save_new_entry is null')
edit_entry_tags ? edit_entry_tags.onclick = () => editEntryTags() : console.log('edit_entry_tags is null')

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

btn_add_tags ? btn_add_tags.onclick = () => addSelectedTagsToEntry(entryTemp, messageDiv, edit_entry_tags, tagTableBody1) : console.log('add_tags btn is null')

btn_remove_tags ? btn_remove_tags.onclick = () => removeSelectedTags(tagTableBody1,messageDiv, title, body, tags) : console.warn('btn_remove_tags is null')

close_btn ? close_btn.onclick = () => toggleTagPopup(main,btn_tags_popup,tagTableBody1) : console.warn('popup close_btn is null')

function editEntryTags() {
    console.warn('editEntryTag called')
    toggleTagPopup(main,btn_tags_popup,tagTableBody1)
}

