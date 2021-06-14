/**
 * The plus/add button in the main.html tag panel,
 * READs tag data and presents in the Tag Creation View.
 */
const btn_addTag:HTMLElement|null = document.querySelector('#t-view');
const tagTableBody:HTMLTableElement|null = document.querySelector('#tag-table-body');
tag_input ? tag_input.onkeyup = filterTable : null;
//TODO Add a succesful message/alert box adding a new tag


btn_addTag ? btn_addTag.onclick =  displayTagView : null;

/**
 * Fills tag table with all tags.
 */
function loadTagTable() {
    
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

/**
 * 
 * @param row HTMLTableRowElement
 */
function makeTTRowClickable(row:HTMLTableRowElement) {
    const plain = 'rgb(224, 221, 210)';//'#e0ddd2'//only works with rgb - becuase style.backgroundColor propertt is returned in rgb
    const highlighted = 'rgb(255, 245, 107)' //'#fff56b';
    const clicked = 'rgb(240, 92, 53)'//'#f05c35';
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

    row.addEventListener('click',function() {
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
 * @return res string of html rows that match
 */
function filterTable() {
    //Ensure search value is not undefined, then displayTagView() if an empty string
    var searchValue:string =  tag_input?.value.toLowerCase() == undefined ? '' : tag_input.value.toLocaleLowerCase();
    searchValue == ''? displayTagView() : '';

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

//TODO - filter by individaul topic - cell[i] - where i is the coloumn number

//TODO - Be able to select tag - from sidebar 

//TODO - Be able to select tag - from TagTable

//TODO 