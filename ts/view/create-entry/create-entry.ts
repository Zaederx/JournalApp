import { ipcRenderer } from "electron";
import clickCreateEntryBtn from './clickCreateEntryBtn'
import { toggleAddTagPopup } from "./tagPopup";
import { addSelectedTagsToEntry } from "../clickable-filter-table/addSelectedTagsToEntry";


var messageDiv = document.querySelector('#message') as HTMLDivElement
var title = document.querySelector('#entry-title') as HTMLDivElement
var body = document.querySelector('#entry-body') as HTMLDivElement
var entry_tags = document.querySelector('#entry-tags') as HTMLDivElement
//Temp
//@ts-ignore
var entryTemp:Entry = new Entry({})
var btn_create_entry = document.querySelector('#create-entry') as HTMLDivElement

//enable create entry button
btn_create_entry ? btn_create_entry.onclick = () =>  clickCreateEntryBtn(entryTemp,title,body,messageDiv) : console.log('btn_create_entry is null');


// ********   Handling The Tag Pop   ********** */

//Buttons
var btn_open_tags_popup = document.querySelector('#btn-add-tags') as HTMLDivElement
var btn_add_tags = document.querySelector('#add-selected-tags') as HTMLDivElement
var btn_close = document.querySelector('#close-btn') as HTMLDivElement
//main container - to be blurred when pop is displayed
var main = document.querySelector('#main') as HTMLDivElement
var popup = document.querySelector('#add-tags-popup') as HTMLDivElement

//Fetch tablebody element
var tagTableBody3 = document.querySelector('#tag-table-body') as HTMLTableElement

//Enable buttons
btn_open_tags_popup? btn_open_tags_popup.onclick = () => toggleAddTagPopup(main,popup, tagTableBody3) : console.log('btn_open_tags_popup is null')

btn_add_tags ? btn_add_tags.onclick = () => addSelectedTagsToEntry(entryTemp,messageDiv,entry_tags, tagTableBody3) : console.log('add_tags btn is null')

btn_close ? btn_close.onclick = () => toggleAddTagPopup(main,popup,tagTableBody3) : console.warn('popup close_btn is null')



// var tag_searchbar = document.querySelector('#tag-searchbar') as HTMLDivElement




 
 
 

 
 