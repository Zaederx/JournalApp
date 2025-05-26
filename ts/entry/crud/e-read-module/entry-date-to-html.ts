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
      //name without file extension
      var entryName = entryDate.name.split('.')[0]
      if (i == 0) {
        filesHTML += '<div class="active entry">'+entryName+'</div>\n';//class must be active entry!
        i++;
      } 
      else {
        filesHTML += '<div>'+entryName+'</div>\n';
      }
    });
    return filesHTML
  }