import { ipcRenderer } from "electron";

var messageDiv = document.querySelector('#message') as HTMLDivElement
var title = document.querySelector('#entry-title') as HTMLDivElement
var body = document.querySelector('#entry-body') as HTMLDivElement
var entry_tags = document.querySelector('#entry-tags') as HTMLDivElement

var btn_create_entry = document.querySelector('#create-entry') as HTMLDivElement

btn_create_entry ? btn_create_entry.onclick = () =>  clickCreateEntryBtn() : console.log('btn_create_entry is null');
/**
 * Returns the current date as a string.
 * @return date as a string
 */

//Temp
//@ts-ignore
var entryTemp:Entry = new Entry({})
async function clickCreateEntryBtn() {
    //get entry text & put in entry object
    var dateStr = await ipcRenderer.invoke('get-datestr')
    entryTemp.date = dateStr
    entryTemp.title = title.innerHTML
    entryTemp.body = body.innerHTML
    //send to backend to be persisted
    var entry_json = JSON.stringify(entryTemp);
    var message:string = await ipcRenderer.invoke('create-entry', entry_json);
    messageDiv.innerText = message
    console.log('create entry message:',message);
}



// ********   Handling The Tag Pop   ********** */

//Buttons
var btn_open_tags_popup = document.querySelector('#btn-add-tags') as HTMLDivElement
var btn_add_tags = document.querySelector('#add-selected-tags') as HTMLDivElement
var btn_close = document.querySelector('#close-btn') as HTMLDivElement
//main container - to be blurred when pop is displayed
var main = document.querySelector('#main') as HTMLDivElement
var popup = document.querySelector('#add-tags-popup') as HTMLDivElement


//Enable buttons
btn_open_tags_popup? btn_open_tags_popup.onclick = () => addTagPopup() : console.log('btn_open_tags_popup is null')
btn_add_tags ? btn_add_tags.onclick = () => addSelectedTagsToEntry() : console.log('add_tags btn is null')
btn_close ? btn_close.onclick = () => toggleAddTagPopup() : console.warn('popup close_btn is null')


// *** Function Definitions ***

//SECTION Toggling Popup
function addTagPopup() {
    console.warn('addEntryTag called')
    toggleAddTagPopup()
}


var hidden = true
function toggleAddTagPopup() {
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
    popup.style.display = 'grid'
}

function hideTagPopup() {
    //display edit tag popup
    popup.style.display = 'none'
}
/**
 * Get Selected Tags
 * @param tagTableBody tableBody to get rows from
 * @returns 
 */
function getSelectdTags(tagTableBody:HTMLTableElement=tagTableBody3) {
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
    //create new entry Temp 
    //@ts-ignore
    entryTemp = new Entry({})
    //for each tag - if not already in tags list -> add to list
    var tagSet = new Set(entryTemp.tags)
    selectedTags.forEach (tag => {
        //if has new - don't add, else add newTag to entry.tags
        tagSet.has(tag) ? null : entryTemp.tags.push(tag)
    })
    //display message
    messageDiv.innerText = 'Tags Added'
    //display tags
    //@ts-ignore
    var e = new Entry({})//for access to class methods (not avaiable to converted JSON to Entry)
    var tagsHTML  = e.tagsToHTML(entryTemp.tags)
    console.log('tagHTML:',tagsHTML)
    entry_tags.innerHTML = tagsHTML
}





 var tagTableBody3 = document.querySelector('#tag-table-body') as HTMLTableElement
 var tag_searchbar = document.querySelector('#tag-searchbar')  as HTMLDivElement


//fill tag popup table
async function fillTagTable(tableBody:HTMLTableElement=tagTableBody3) {
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

 
 
 const plain = ''//'rgb(224, 221, 210)';//'#e0ddd2'//only works with rgb - becuase style.backgroundColor property is returned in rgb
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
 function filterTable(tagTableBody:HTMLTableElement=tagTableBody3, input:HTMLDivElement=tag_searchbar) {
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
