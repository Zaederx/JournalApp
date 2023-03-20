/**
   * 
   * @param directoryFolders directory folder names
   */
export function directoryFoldersToHTML(directoryFolders:string[]) {
    var counter:number = 0
    var dirHTML:string = ''
    directoryFolders.forEach( subdirectoryName => {
        if(subdirectoryName.charAt(0) == '.') {/*DO NOT ADD*/}//so it doesn't add .DS_Store files etc
        else if (counter == 0) {
            dirHTML += '<div class="active tag">'+subdirectoryName+'</div>\n';//must be active tag!
            counter++;
        }
        else {
            dirHTML += '<div>'+subdirectoryName+'</div>\n';
        }
      });
      return dirHTML
  }
