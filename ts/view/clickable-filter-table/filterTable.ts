/**
  * Filters html table against input.
  * Returns result of the search as a string.
  * Loops thorugh each `<tr>` and checks if any `td` cell
  * matches the input. If a match if found in any cell, display that entire row,
  * otherwise hide the entire row that the cell belongs to.
  * @param tagTableBody - table to be filtered
  * @param searchbar - the search bar the take the user input
  * @return res string of html rows that match
  */
export default function filterTable(tagTableBody:HTMLTableElement, searchbar:HTMLDivElement) {
    console.log('*** function filterTable called ***')
    //Ensure search value is not undefined, then displayTagView() if an empty string
    var searchValue:string =  searchbar?.innerText.toLowerCase() == undefined ? '' : searchbar.innerText.toLocaleLowerCase();

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
