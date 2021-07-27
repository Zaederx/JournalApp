import { ipcRenderer } from "electron"

//messageDiv
var messageDiv = document.querySelector('#message') as HTMLDivElement
//  Entry
var title = document.querySelector('#entry-title') as HTMLDivElement
var body = document.querySelector('#entry-body') as HTMLDivElement
var tags = document.querySelector('#entry-tags') as HTMLDivElement
window.onload = () => displayCurrentEntry()

//Div Buttons
var update_entry = document.querySelector('#update-entry') as HTMLDivElement
var save_new_entry = document.querySelector('#save-new-entry') as HTMLDivElement
var edit_entry_tags = document.querySelector('#edit-entry-tags') as HTMLDivElement

update_entry ? update_entry.onclick = () => updateEntry() : console.log('update_entry is null')
save_new_entry ? save_new_entry.onclick = () => saveNewEntry() : console.log('save_new_entry is null')
edit_entry_tags ? edit_entry_tags.onclick = () => editEntryTags() : console.log('edit_entry_tags is null')

//Functions
var e = new Entry()
window.onload = () => displayCurrentEntry()

//display entry
async function displayCurrentEntry() {
    //get current entryJson
    var entryJson:string = await ipcRenderer.invoke('get-current-entry')
    // parse JSON to an Entry
    var entry:Entry = JSON.parse(entryJson)
    // put entry details into html frontend
    title.innerHTML = entry.title
    body.innerHTML = entry.body
    tags.innerHTML = e.tagsToHTML(entry.tags)
}

async function updateEntry() {
    //get entry tags from html tags div
    var tagsArr = tagsToArr(tags)
    //create and entry with updated title, boy and tags[]
    var entry = new Entry(title.innerText,body.innerText, tagsArr)
    //turn entry to json format - ready for saving to file
    var entry_json = JSON.stringify(entry);
    //get current entry name
    var entryName = await ipcRenderer.invoke('get-current-entry-name')
    //send to main for be updated
    var message = await ipcRenderer.invoke('update-entry', entry_json, entryName)
    //displat message
    messageDiv.innerText = message
}

function tagsToArr(tags:HTMLDivElement) {
    var arr:string[] = []
    //get tag names from tags div
    tags.querySelectorAll('div').forEach( tag => { 
        //add tag names to arr
        arr.push((tag as HTMLDivElement).innerText)
    })
    //return arr for tag names
    return arr
}

async function saveNewEntry() {
    //get entry tags from html tags div
    var tagsArr = tagsToArr(tags)
    //create and entry with updated title, boy and tags[]
    var entry = new Entry(title.innerText,body.innerText, tagsArr)
    //send to main for be persisted
    var message = await ipcRenderer.invoke('create-entry', entry)
    //display message
    messageDiv.innerText = message
}


//******** Handling The Tag Pop ********** */
var btn_tags_popup = document.querySelector('#edit-tags-popup') as HTMLDivElement
var btn_add_tags = document.querySelector('#add-selected-tags') as HTMLDivElement
var btn_remove_tags = document.querySelector('#remove-selected-tags') as HTMLDivElement
var main = document.querySelector('#main-container') as HTMLDivElement
var close_btn = document.querySelector('#close-btn') as HTMLDivElement

btn_add_tags ? btn_add_tags.onclick = () => addSelectedTagsToEntry() : console.log('add_tags btn is null')
btn_remove_tags ? btn_remove_tags.onclick = () => removeSelectedTags() : console.warn('btn_remove_tags is null')
close_btn ? close_btn.onclick = () => toggleEditTagPopup() : console.warn('popup close_btn is null')

function editEntryTags() {
    console.warn('editEntryTag called')
    toggleEditTagPopup()
}

/**
 * Get Selected Tags
 * @param tagTableBody tableBody to get rows from
 * @returns 
 */
function getSelectdTags(tagTableBody:HTMLTableElement=tagTableBody1) {
    var rows = tagTableBody?.querySelectorAll('tr')
    var tags:string[] = []
    rows.forEach( row => {
        //add tags if selected/clicked
        if (row.style.backgroundColor == clicked) {
            tags.push(row.cells[0].innerHTML)
        }
    })
    return tags
}


async function addSelectedTagsToEntry() {
    //get selected tags
    var selectedTags:string[] = getSelectdTags()
    //get current entry
    var entryJson = await ipcRenderer.invoke('get-current-entry')
    var entry:Entry = JSON.parse(entryJson)
    //for each tag - if not already in tags list -> add to list
    var tagSet = new Set(entry.tags)
    selectedTags.forEach (tag => {
        //if has new - dont add, else add newTag to entry.tags
        tagSet.has(tag) ? null : entry.tags.push(tag)
    })
    //persist changes
    var newEntryJson = JSON.stringify(entry)
    var message = await ipcRenderer.invoke('update-current-entry',newEntryJson)
    //display message
    messageDiv.innerText = message
    //page refresh
    displayCurrentEntry()
}

async function removeSelectedTags() {
    var selectedTags:string[] = getSelectdTags()
    //get current entry
    var entryJson = await ipcRenderer.invoke('get-current-entry')
    var entry:Entry = JSON.parse(entryJson)
    //for each tag - remove if in list
    var tagToRemove = new Set(selectedTags)
    var i = 0
    var tempTags:string[] = [] 
    tempTags = entry.tags.slice()
    tempTags.forEach (tag => {
        console.log('iteration:',i)
        console.log('tag:',tag)
        //if tag is in set of tags to remove - then remove 
        //...(unless tag is 'all' - every entry is part of all)
        tagToRemove.has(tag) && tag != 'all' ? entry.tags.splice(i,1) : i++
        console.log('tagToRemove:',tagToRemove.has(tag))
    })
    //persist changes
    var newEntryJson = JSON.stringify(entry)
    console.log('newEntryJson:',newEntryJson)
    var message = await ipcRenderer.invoke('update-current-entry',newEntryJson)
    //display message
    messageDiv.innerText = message
    //page refresh
    displayCurrentEntry()
}

var hidden = true
function toggleEditTagPopup() {
    if (hidden == true) {
        displayTagPopup()
        fillTagTable()
        blurBackground()
        hidden = false
    }
    else {
        hideTagPopup()
        unblurBackground()
        hidden = true
    }
}




function blurBackground() {
    main.className = 'main-container-blur'
}

function unblurBackground() {
    main.className = 'main-container'
}
    

function displayTagPopup() {
    //display edit tag popup
    btn_tags_popup.style.display = 'grid'
}

function hideTagPopup() {
    //display edit tag popup
    btn_tags_popup.style.display = 'none'
}


// Handling Popup table filtering
//  var btn_addTag = document.querySelector('#t-view') as HTMLDivElement
 var tagTableBody1 = document.querySelector('#tag-table-body') as HTMLTableElement
 var tag_searchbar = document.querySelector('#tag-searchbar')  as HTMLDivElement

 
//fill tag popup table
async function fillTagTable(tableBody:HTMLTableElement=tagTableBody1) {
    //get all html tags
    var tagsHTML = await ipcRenderer.invoke('get-tags-table-rows')
    console.log('tagsHTML',tagsHTML)
    //fill table with html tag information
    tableBody.innerHTML = tagsHTML
    var rows = tableBody?.querySelectorAll('tr');
    //make row clickable - i.e. highlight on click and mouseover events
    rows?.forEach( row => {
        makeTTRowClickable(row as HTMLTableRowElement);
    });
}

//Note: These only works with rgb - becuase style.backgroundColor property is returned in rgb
 const plain = ''//'rgb(224, 221, 210)';//'#e0ddd2'
 const highlighted = 'rgb(255, 245, 107)' //'#fff56b';
 const clicked = 'rgb(240, 92, 53)'//'#f05c35';
 /**
  * 
  * @param row HTMLTableRowElement
  */
 function makeTTRowClickable(row:HTMLTableRowElement) {
    console.log('\n\n\n\n\n**********row:'+row+'*************\n\n\n\n\n\n\n');
    const toRemove = '#f05c35';  //#86f9d6
    //add css class
    row.className = 'table-row'
    //if mouse goes over row - highlight it yellow
    row.addEventListener('mouseover', function (event) {
        console.log('mouseover:'+highlighted);
        if (row.style.backgroundColor == clicked) {console.log('backgroundColor == clicked');row.style.backgroundColor = clicked;}
        else {
            row.style.backgroundColor = (row.style.backgroundColor != clicked && row.style.backgroundColor != highlighted) ?  highlighted : row.style.backgroundColor;
        }
    });
    //if mouse leaves row - unhighlight it
    row.addEventListener('mouseleave',function(event) {
        console.log('left:'+plain);
        console.log('\n\n\n\n\n**********row:'+row.style.backgroundColor+'*************\n\n\n\n\n\n\n')
        if (row.style.backgroundColor == clicked) {console.log('backgroundColor == clicked');row.style.backgroundColor = clicked;}
        else {row.style.backgroundColor = row.style.backgroundColor == highlighted ?  plain: row.style.backgroundColor;}
    });
    //if row is clicked - highlight if red
    row.addEventListener('click',function(event) {
        console.log('clicked:'+clicked);
        row.style.backgroundColor = row.style.backgroundColor != clicked ? clicked : plain;
    });
 }
 
 /**
  * Encloses tag names in html.
  * This is used in preparation for being added
  * to html table body.
  * 
  * i.e.:
  * ``` 
  * var html:string = '';
  * tags.forEach( tag => {
  *     html += '<tr><td>'+tag+'</td></tr>\n';
  * });
  * return html;
  * ```
  * @param tags array of tagnames
  * @return html
  */
 function tagsToHtml(tags:string[]):string {
     var html:string = '';
     tags.forEach( tag => {
         if (tag.charAt(0) == '.') {/* Do not add .DS_STORE / System files*/}
         else html += '<tr>\n'+
         '<td>'+tag+'</td>\n' + 
         '<td>'+'default'+'</td>\n' + 
         '<td>'+'default'+'</td>\n'
         +'</tr>\n';
     });
     return html;
 }
 
 /**
  * Filters html table against input.
  * Returns result of the search as a string.
  * Loops thorugh each `<tr>` and checks if any `td` cell
  * matches the input. If a match if found in any cell, display that entire row,
  * otherwise hide the entire row that the cell belongs to.
  * @param tagTableBody - table to be filtered
  * @param input - the search bar the take the user input
  * @param displayViewFunc - the function that returns the view (need to refresh view after filtering to work)
  * @return res string of html rows that match
  */
 function filterTable(tagTableBody:HTMLTableElement=tagTableBody1, input:HTMLDivElement=tag_searchbar) {
    console.log('*** filterTable called ***')
    //Ensure search value is not undefined, then displayTagView() if an empty string
    var searchValue:string =  input?.innerText.toLowerCase() == undefined ? '' : input.innerText.toLocaleLowerCase();

    //Get all rows
    var rows = tagTableBody?.querySelectorAll('tr');
    var res = '';
    
    //In each row, check if any cells have a match
    rows?.forEach ( row => {
        var matchFound:boolean = false;
        var cells = row.querySelectorAll('td');//could also use row.cells
        cells.forEach ( cell => {
            matchFound = cell.innerHTML.toLowerCase().indexOf(searchValue) > -1 ?  true : matchFound; 
        });
        /*if matchFound in any cell of a row, add the whole row to results
        @ts-ignore - tsc thinks it will always evaluate to false...It doesn't...*/
        matchFound == true ?  row.style.display = '' : row.style.display = 'none';
    });
 }