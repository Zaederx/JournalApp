import { ipcRenderer } from "electron"

/** message Div*/
var messageDiv = document.querySelector('#message') as HTMLDivElement

/** Buttons */ 
var add_tag_btn = document.querySelector('#add-new-tag') as HTMLDivElement
var remove_tag_btn = document.querySelector('#remove-selected-tags') as HTMLDivElement
add_tag_btn ? add_tag_btn.onclick = () => createNewTag() : console.warn('add_tag_btn is null')
remove_tag_btn ? remove_tag_btn.onclick = () => removeSelectedTags() : console.warn('remove_tag_btn is null')

/** Searchbar */
var tag_searchbar = document.querySelector('#tag-searchbar') as HTMLDivElement
tag_searchbar.oninput = () => filterTable()


/**
 * Creates a new tag
 */
async function createNewTag() 
{
    //get input
    var tag:string = tag_searchbar.innerText
    if (tag != null && tag != '') 
    {
        //send tag to be persisted
        var message = await ipcRenderer.invoke('create-tag', tag)
        // display message
        messageDiv.innerText = message
        //refresh tag table
        fillTagTable()
    }
}

/**
 * Remove selected tags
 */
async function removeSelectedTags() 
{
    //get selectedTags
    var tags:string[] = getSelectedTags()
    //remove 'all' tag from tags
    var tagsCopy = []
    for(var i = 0; i < tags.length; i++) {
        //if tag is not 'all' tag
        if(tags[i] != 'all')
        { 
            tagsCopy.push(tags[i])
        }
    }
    //if there's nothing no tags - do nothing
    if(tagsCopy.length > 0 || tagsCopy.length != null || tagsCopy.length != undefined)
    {
        
        //remove display message if only attempting to remove 'all' tag
        if(tagsCopy[0] != 'all')
        {
            //send tag to be deleted
            var message = await ipcRenderer.invoke('delete-tags', tagsCopy)
            //display message
            messageDiv.innerText = message
        }
        //else nothing
        
        //refresh tag table
        fillTagTable()
    }
    
}



//Table filtering
window.onload = () => fillTagTable()

//var btn_addTag = document.querySelector('#t-view') as HTMLDivElement
var theTagTableBody = document.querySelector('#tag-table-body') as HTMLTableElement
var tag_searchbar = document.querySelector('#tag-searchbar')  as HTMLDivElement

/** fill tag popup table */
async function fillTagTable(tableBody:HTMLTableElement=theTagTableBody) 
{
   //get all html tags
   var tagsHTML = await ipcRenderer.invoke('get-tags-table-rows')
   console.log('tagsHTML', tagsHTML)
   //fill table with html tag information
   tableBody.innerHTML = tagsHTML
   var rows = tableBody?.querySelectorAll('tr');
   //make row clickable - i.e. highlight on click and mouseover events
   rows?.forEach( row => {
        makeTTRowClickable(row as HTMLTableRowElement);
        //if row is for the all tag - remove event highlighting
        if (row.cells[0].innerText == 'all') 
        {
            row.addEventListener('mouseover', function(){})
            row.addEventListener('mouseleave', function(){})
            row.addEventListener('mouseclick', function (){})
            row.style.backgroundColor = ''
        }
       
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
       if (row.style.backgroundColor == clicked) 
       {
        console.log('backgroundColor == clicked');
        row.style.backgroundColor = clicked;
        }
       else 
       {
            //set text colour to highlighted if not already clicked and not highlighted
           row.style.color = (row.style.backgroundColor != clicked && row.style.backgroundColor != highlighted) ?  'black' : row.style.color;
            //set background color to highlighted if not already clicked and not highlighted
           row.style.backgroundColor = (row.style.backgroundColor != clicked && row.style.backgroundColor != highlighted) ?  highlighted : row.style.backgroundColor;
           
       }
   });
   //if mouse leaves row - unhighlight it
   row.addEventListener('mouseleave',function(event) {
        //console log
       console.log('left:'+plain);
       console.log('\n\n\n\n\n**********row:'+row.style.backgroundColor+'*************\n\n\n\n\n\n\n')

       //if background color clicked - keep it clicked
       if (row.style.backgroundColor == clicked) 
       {
        console.log('backgroundColor == clicked');row.style.backgroundColor = clicked;
        }
        //else (when not clicked) change it to plain
       else 
       {
        row.style.color = row.style.backgroundColor == highlighted ?  plain: row.style.color;
        row.style.backgroundColor = row.style.backgroundColor == highlighted ?  plain: row.style.backgroundColor;
        }
   });
   //if row is clicked - highlight if red
   row.addEventListener('click',function(event) {
       console.log('clicked:'+clicked);
       row.style.backgroundColor = row.style.backgroundColor != clicked ? clicked : plain;
   });
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
function filterTable(tagTableBody:HTMLTableElement=theTagTableBody, input:HTMLDivElement=tag_searchbar) {
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
       /* if matchFound in any cell of a row, add the whole row to results
       @ts-ignore - tsc thinks it will always evaluate to false...It doesn't...*/
       matchFound == true ?  row.style.display = '' : row.style.display = 'none';
   });
}


/**
 * Get Selected Tags
 * @param tagTableBody tableBody to get rows from
 * @returns 
 */
 function getSelectedTags(tagTableBody:HTMLTableElement=theTagTableBody) {
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