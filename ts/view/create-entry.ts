import { ipcRenderer } from "electron";
import clickCreateEntryBtn from './create-entry/clickCreateEntryBtn'
import toggleTagPopup from "./create-entry/tagPopup";
import { addSelectedTagsToEntry } from "./clickable-filter-table/table";
import Entry from "../classes/entry"
import * as html from './create-entry/elements';


// const messageDiv = document.querySelector('#message') as HTMLDivElement
const title = document.querySelector('#entry-title') as HTMLDivElement
const body = document.querySelector('#entry-body') as HTMLDivElement
const tags = document.querySelector('#entry-tags') as HTMLDivElement
//Temp
//@ts-ignore
var entryTemp:Entry = new Entry({})
/** Create and Add Tgas buttons */
const btn_create_entry = document.querySelector('#create-entry') as HTMLDivElement
const btn_open_tags_popup = document.querySelector('#btn-add-tags') as HTMLDivElement
//enable create entry button
btn_create_entry ? btn_create_entry.onclick = () =>  clickCreateEntryBtn(entryTemp, title, body, tags) : console.log('btn_create_entry is null');


/** Tags popup  */
const btn_add_tags = document.querySelector('#add-selected-tags') as HTMLDivElement
const btn_close = document.querySelector('#close-btn') as HTMLDivElement
//main container - to be blurred when pop is displayed
const main = document.querySelector('#main') as HTMLDivElement
const popup = document.querySelector('#add-tags-popup') as HTMLDivElement

//Fetch tablebody element
const tagTableBody3 = document.querySelector('#tag-table-body') as HTMLTableElement

//Enable buttons
btn_open_tags_popup? btn_open_tags_popup.onclick = () => toggleTagPopup(main,popup, tagTableBody3) : console.log('btn_open_tags_popup is null')

btn_add_tags ? btn_add_tags.onclick = () => addSelectedTagsToEntry(entryTemp,html.entry_tags, tagTableBody3) : console.log('add_tags btn is null')

btn_close ? btn_close.onclick = () => toggleTagPopup(main, popup, tagTableBody3) : console.warn('popup close_btn is null')




 
 
 

 
 