

/**
 * Sends single entries to the files.
 * Converts each entry file to HTML and 
 * sends via ipcMain.
 * @param files 
 */
export function sendTagEntriesToHTML(files:string[], ipcMain:any) {
    var filesHTML = '';
    var i = 0;
    files.forEach( (filename) => {
        if (i == 0) {
            var entry = '<div class="active entry">'+filename+'</div>\n';//class must be active tag!
            ipcMain.emit('recieve-list-all-entries-html', entry)
        }
        // else {
        //     filesHTML += '<div>'+filename+'</div>\n';
        // } 
    })
    // return filesHTML
  }