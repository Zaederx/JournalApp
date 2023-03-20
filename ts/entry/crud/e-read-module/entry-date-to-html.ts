import EntryDate from "../../../classes/entry-date";

/**
 * Takes sorted array of EntryDates and ouputs entry html divs
 * for the navigation panel
 * @param arr 
 * @returns 
 */
export function entryDateToHtml(arr:EntryDate[]) {
    var filesHTML = ''
    var i:number = 0;
    arr.forEach(entryDate => {
      if (i == 0) {
        filesHTML += '<div class="active entry">'+entryDate.name+'</div>\n';//class must be active entry!
        i++;
      } 
      else {
        filesHTML += '<div>'+entryDate.name+'</div>\n';
      }
    });
    return filesHTML
  }