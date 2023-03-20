/**
 * Takes files arr and returns them as HTML
 * @param files - filenames
 * @param directory - diretory of the files - the tag 'all' directory in our case
 * @returns 
 */
export function tagFilesToHTML(files:string[]) {
    var filesHTML = '';
    var i = 0;
    files.forEach( (filename) => {
        if (i == 0) {
            filesHTML += '<div class="active tag">'+filename+'</div>\n';//class must be active tag!
            i++;
          } 
          else {
            filesHTML += '<div>'+filename+'</div>\n';
          }
    })
    return filesHTML
  }