/**
 * The plus/add button in the main.html tag panel,
 * READs tag data and presents in the Tag Creation View.
 */
const btn_addTag:HTMLElement|null = document.querySelector('#t-view');
const tagTableBody1:HTMLTableElement = document.querySelector('#tag-table-body') as HTMLTableElement;

tag_input ? tag_input.onkeyup = ()=>filterTable() : console.log('tag_input is null');
//TODO Add a succesful message/alert box adding a new tag


btn_addTag ? btn_addTag.onclick =  displayTagView : console.log('btn_addTag is null');

/**
 * Fills tag table with all tags.
 */
function loadTagTable(tagTableBody:HTMLTableElement=tagTableBody1) {
    
    //ipcMessage - requests tag to be read
    window.CRUD.readTags(); 
    //wait for for ipc response -> load tag table
    window.tagCRUD.readAllTags((tags:string[]) => {
        // if(tagTableBody != null)
        // var promise = new Promise<HTMLTableElement|null>((resolve) => {
        //     tagTableBody!.innerHTML =  tagsToHtml(tags);
        //     resolve(tagTableBody);
        // });
        var promise = new Promise<HTMLTableElement|null>((resolve, reject) => {
            tagTableBody? tagTableBody.innerHTML =  tagsToHtml(tags) : reject();
            resolve(tagTableBody);
        });

        promise.then((tagTableBody) => {
            var rows = tagTableBody?.querySelectorAll('tr');
            rows?.forEach( row => {
                makeTTRowClickable(row as HTMLTableRowElement);
            }); 
        });
    });
}


const plain = 'rgb(224, 221, 210)';//'#e0ddd2'//only works with rgb - becuase style.backgroundColor property is returned in rgb
const highlighted = 'rgb(255, 245, 107)' //'#fff56b';
const clicked = 'rgb(240, 92, 53)'//'#f05c35';
/**
 * 
 * @param row HTMLTableRowElement
 */
function makeTTRowClickable(row:HTMLTableRowElement) {
    
    console.log('\n\n\n\n\n**********row:'+row+'*************\n\n\n\n\n\n\n');
    const toRemove = '#f05c35';  //#86f9d6

    row.addEventListener('mouseover', function (event) {
        console.log('mouseover:'+highlighted);
        if (row.style.backgroundColor == clicked) {console.log('backgroundColor == clicked');row.style.backgroundColor = clicked;}
        else {
            row.style.backgroundColor = (row.style.backgroundColor != clicked && row.style.backgroundColor != highlighted) ?  highlighted : row.style.backgroundColor;
        }
        
    });

    row.addEventListener('mouseleave',function(event) {
        console.log('left:'+plain);
            console.log('\n\n\n\n\n**********row:'+row.style.backgroundColor+'*************\n\n\n\n\n\n\n')
        if (row.style.backgroundColor == clicked) {console.log('backgroundColor == clicked');row.style.backgroundColor = clicked;}
        else {row.style.backgroundColor = row.style.backgroundColor == highlighted ?  plain: row.style.backgroundColor;}
    });

    row.addEventListener('click',function(event) {
        console.log('clicked:'+clicked);
        row.style.backgroundColor = row.style.backgroundColor != clicked ? clicked : plain;

        //get text of selected row - to be passed to delete function - tag-delete.ts -> selectedDropdownTag
        if (row.style.backgroundColor == clicked) {
            selectedDropdownTag = row.cells[0].textContent as string
         }
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
function filterTable(tagTableBody:HTMLTableElement=tagTableBody1, input:HTMLInputElement=tag_input) {
    //Ensure search value is not undefined, then displayTagView() if an empty string
    var searchValue:string =  input?.value.toLowerCase() == undefined ? '' : input.value.toLocaleLowerCase();
    // searchValue == ''? displayViewFunc() : '';

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

//TODO - filter by individual topic - cell[i] - where i is the coloumn number

//TODO - Be able to select tag - from sidebar 

//TODO - Be able to select tag - from TagTable

//TODO Add tag to entry
// const btn_addTag = document.querySelector('#btn-add-tag') as HTMLButtonElement
// var highlightedRow:HTMLTableRowElement
// btn_addTag ? btn_addTag.onclick = () => addTagToEntry() : null

// function addTagToEntry() {
//     var text = highlightedRow.cells[0].textContent
//     var tagText = '\n<span>'+text+'</span>\n'
//     var tagPins = document.querySelector('#tags-pins') as HTMLElement
//     tagPins.innerHTML += tagText
// }