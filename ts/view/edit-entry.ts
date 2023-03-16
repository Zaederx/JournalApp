import { ipcRenderer } from "electron"

import { tagsToArr } from "./edit-entry/tags-to-array"
import displayCurrentEntry from "./display/displayCurrentEntry"
import saveNewEntry from "./edit-entry/saveNewEntry"
import { toggleTagPopup } from "./create-entry/tagPopup"
import { addSelectedTagsToEntry, removeSelectedTags } from "./clickable-filter-table/table"
import Entry from "../classes/entry"

//Fetch HTML Elements
const messageDiv = document.querySelector('#message') as HTMLDivElement
const title = document.querySelector('#entry-title') as HTMLDivElement
const body = document.querySelector('#entry-body') as HTMLDivElement
const tags = document.querySelector('#entry-tags') as HTMLDivElement

//Div Buttons
var update_entry = document.querySelector('#update-entry') as HTMLDivElement
var save_new_entry = document.querySelector('#save-new-entry') as HTMLDivElement
var edit_entry_tags = document.querySelector('#edit-entry-tags') as HTMLDivElement

//Enable events
window.onload = () => displayCurrentEntry(title,body,tags)
update_entry ? update_entry.onclick = () => updateEntry() : console.log('update_entry is null')
save_new_entry ? save_new_entry.onclick = () => saveNewEntry(tags,messageDiv) : console.log('save_new_entry is null')
edit_entry_tags ? edit_entry_tags.onclick = () => editEntryTags() : console.log('edit_entry_tags is null')

//Functions
//@ts-ignore
var entryTemp = new Entry({})
window.onload = () => displayCurrentEntry(title,body,tags)



/**
 * Updates the current entry
 * (instead of saving separate copy)
 */
async function updateEntry() {
    console.log('function updateEntry called')
    //get entry tags from html tags div
    var tagsArr = tagsToArr(tags)
    //create and entry with updated title, boy and tags[]
    //@ts-ignore
    var entry = new Entry({title:title.innerHTML,body:body.innerHTML, tags:tagsArr})
    //turn entry to json format - ready for sending via ipcRenderer - can't send complex objects
    var entry_json = JSON.stringify(entry);
    console.info('updateEntry - entry_json: ' + entry_json);
    //get current entry name
    var entryName = await ipcRenderer.invoke('get-current-entry-name')
    //send entry_json and entryName to main to be updated
    var message = await ipcRenderer.invoke('update-entry', entry_json, entryName)
    //display message
    messageDiv.innerText = message
}

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

