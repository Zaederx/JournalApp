import * as fs from 'fs';
import * as dirs from '../../directory';
import * as eSort from '../../algorithms/entrysort'
import {readDirFiles} from '../../entry/crud/e-read'
import {Tag} from '../../classes/tag'
import * as tSort from '../../algorithms/tagsort'
import { TagDate } from '../../classes/tagdate';
import * as process from 'child_process';
import paths from 'path'
import { app } from 'electron'
import { EntryDate } from '../../classes/EntryDate';


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
       var path = dirs.tagDirectory
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
/**
 * Returns array of `tagDir` contents (not recursively).
 * i.e. only at that immediate folder level - not each of the folders descendants
 * `tagDir` contains all tag directories. However this method may also 
 * return automatically generated System files located in `tagDir`.
 * Used readAllTags method if necessary to only tag directories returned,
 * without any possible system files.
 * Note: often more efficient to use readTagDir, but filter 
 * out System files on during other necessary looping that happens
 * while accessing array of tags directory name.
 * @return directoryContexts    array of tag directory names
 */
export function readTagDir():Promise<string[]> {
    return readDir(dirs.tagDirectory)
}

/**
 * Finds birthtime of an entry (as a number).
 * Once the birthtime is known, it creates an {@link EntryDate}
 * and adds it to the given array.
 * @param file name of the subdirectory - i.e. tagDirectory 
 * @param arr an array of EntryDate
 * @see EntryDate
 */
 function fetchBtime(prefix:string,file:string, arr:EntryDate[]) {
    /*
     * From ZSH manual under 'stat' - see zsh terminal command 'man stat':
     * 
     *  -f format
                 Display information using the specified format.  See the FORMATS
                 section for a description of valid formats.
    
     * -L      Use stat(2) instead of lstat(2).  The information reported by
                 stat will refer to the target of file, if file is a symbolic
                 link, and not to file itself.
     */
    //Addtionally - %B inserts File BirthTime (Creation Date)
      var stat_birth = process.spawnSync('stat',['-f','%B', '-L', prefix+file]);
      console.log('output',stat_birth.output);
      var bString:string = stat_birth.stdout;
      var btime:number = Number(stat_birth.stdout);
      var eDate:TagDate = new TagDate(file, btime);
      arr.push(eDate);
      console.log('bString',bString);
      console.log('btime',btime);
      var err:string = stat_birth.stderr;
      err != '' ? console.error('File Birthtime error:',err) : null;
  
      var code:number|null = stat_birth.status;
      console.log('child process: "stat_birth" exited with code',code);
  }

/**
 * 
 * @param dir main directory path i.e. './hello'
 * @param and optional addition to the path
 * 
 */
async function readDir(dir:string):Promise<string[]> {
    var directoryContents:string[] = [];
    try {
        //using readdirSync - blocks IO until the read is done
        var directoryContents = await fs.promises.readdir(dir, {
            encoding: 'utf-8',/* Note: note the default. setting encoding to 'utf8' explicitly informs typescript -> only string[] not string[]|Buffer[] to be returned*/
            withFileTypes: false
        });
    }
    catch (err){
        console.error('Entry folder',dir,' could not be read');
    }
    return directoryContents;
}

/**
 * Does the same as `readTagDir()` but removes files beinging with '.'
 * i.e. .DS_Store or other hidden system files.
 * 
 * Note: often better to use readTagDir if intending to later
 * loop or recurse through directory contents (so that 
 * the operation does have to be performed twice)
 * @return tags directoryContents with system files
 * (files beginning with '.') removed.
 */
export async function readAllTags():Promise<string[]> {
  var directory:string[] = await readTagDir();
  var tags:string[] = [];
  directory.forEach((tag:string) => {
      if (tag.charAt(0) != '.'){
          tags.push(tag);
      }
  });
    return tags;
}

export async function readTagEntries(tagName:string) {
    var path = paths.join(dirs.tagDirectory,tagName)
   var files = await readDirFiles(path);
   var filesHTML = tagFilesToHtml(files)
   return filesHTML
}

/**
 * Takes files arr and returns them as HTML
 * @param files - filenames
 * @param directory - diretory of the files - the tag 'all' directory in our case
 * @returns 
 */
 export function tagFilesToHtml(files:string[]) {
    var filesHTML = '';
    var i = 0;
    files.forEach( (filename) => {
        if (i == 0) {
            filesHTML += '<div class="active tag">'+filename+'</div>\n';//class must be active entry!
            i++;
          } 
          else {
            filesHTML += '<div>'+filename+'</div>\n';
          }
    })
    return filesHTML
  }


/**
 * Get an array of tags -> tagname, entry count and 
 * creation date of the tag directory
 */
export async function getTags_EntryCount_CreationDate():Promise<string> {
    console.log('*** getTags_EntryCount_CreationDate called ***')
    var tagsHTMLArr:string[] = []
    var tagsStrArr:string[] = await readAllTags()
    console.log('tagsStrArr:',tagsStrArr)
    //for each - get entry count and creation date
     for(var tName of tagsStrArr) {
         console.log('tName:',tName)
        var count = await getTag_EntryCount(tName)
        var date = await getTag_CreationDate(tName);
        var tag = new Tag(tName,count,date)
        console.log('tag.toHTML:',tag.toHTML())
        tagsHTMLArr.push(tag.toHTML())
     }
    
    var tagsHTML = ''
    tagsHTMLArr.forEach( (t) => {
        console.log('t:',t)
        tagsHTML += t
    })
    console.log('tagsHTML',tagsHTML)
    return tagsHTML
}

// async function tagStrArr_toTagsHTMLArr(tName:string) {
//     var count = getTag_EntryCount(tName)
//     var date = await getTag_CreationDate(tName)
//     var tag = new Tag(tName,count,date)
//     console.log('tag.toHTML:',tag.toHTML())
//     tagsHTMLArr.push(tag.toHTML())
//     return tagsHTMLArr
// }

/**
 * Get a tally(count) of a tag directories entries.
 * @param tag - name of the tag
 * @returns 
 */
async function getTag_EntryCount(tag:string):Promise<number> {
    var path = paths.join(dirs.tagDirectory,tag)
    var entries = await readDir(path)
    return entries.length
}
/**
 * Get a Tag's Creation Date as a string (Promise<string>)
 * @param tag - name of the tag
 * @returns 
 */
async function getTag_CreationDate(tag:string):Promise<string> {
    var path = paths.join(dirs.tagDirectory,tag)
    var {birthtime} = await fs.promises.stat(path)
    var btimeStr = birthtime.toDateString()
    return btimeStr
}