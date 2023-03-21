import { app } from 'electron'
import paths from 'path'
import * as fs from 'fs'

/**
 * Read all tag Directories names
 * Used to fill tag directory side bar/panel
 * @param event - An Electron Event
 * 
 * Note: node has problem with fs.readdirSync (withFileTypes: false) option </br>
 * @see:{@link https://github.com/electron/electron/pull/24062#issuecomment-687702317}
 * 
 * @see:{@link https://github.com/electron/electron/issues/19074}
 */
export async function readAllDirectoryNames() {
    console.log('readAllDirectoryNames')
    var tagDirectories:string[] = [];
    
    try {
        var path = paths.join(app.getPath('userData'), 'tagDir')
        tagDirectories = await fs.promises.readdir(path, {
          withFileTypes: false,
          encoding: 'utf-8'
        });
        console.log('tagDirectories:',tagDirectories)
        return tagDirectories
    } catch (err) {
        console.error('Entry folder could not be read');
    }

    return tagDirectories;//empty condition
}

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
