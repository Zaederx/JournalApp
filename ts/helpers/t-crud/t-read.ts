import * as fs from 'fs';
import * as dir from '../directory';
import * as eSort from '../algorithms/entrysort'
import {readDirFiles} from '../e-crud/e-read';
import {Tag} from '../../classes/tag'
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
export function readTagDir():string[] {
    //IMPORTANT sort Directories that are to be returned
    // var arr = readDir(dir.tagDirectory)
    // eSort.sort(arr,0,arr.length-1)
    return readDir(dir.tagDirectory);
}

/**
 * 
 * @param dir main directory path i.e. './hello'
 * @param and optional addition to the path
 * 
 * ```
 * readDir('./hello', 'there') -> path looks like './hello/there'
 * ```
 */
function readDir(dir:string, and?:string):string[] {
    var directory:string[] = [];
    try {
        //using readdirSync - blocks IO until the read is done
        var directory = fs.readdirSync(dir+(and?and+'/':''), {
            encoding: 'utf-8',/* Note: thoguh the default, setting encoding to 'utf8' explicitly informs typescript -> only string[] not string[]|Buffer[] to be returned*/
            withFileTypes: false
        });
    }
    catch (err){
        console.error('Entry folder could not be read');
    }
    return directory;
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
export function readAllTags():string[] {
  var directory:string[] = readTagDir();
  var tags:string[] = [];
  directory.forEach((tag:string) => {
      if (tag.charAt(0) != '.'){
          tags.push(tag);
      }
  });
    return tags;
}

export function readTagEntries(event:Electron.IpcMainEvent,tagName:string) {
   readDirFiles(dir.tagDirectory+(tagName ? tagName+'/':''),event,'response-t-read');
}


/**
 * Get an array of tags -> tagname, entry count and 
 * creation date of the tag directory
 */
export async function getTags_EntryCount_CreationDate():Promise<string[]> {
    var tagsHTML:string[] = []
    var tagsStr:string[] = readTagDir()
    //for each - get entry count and creation date
    tagsStr.forEach( async (tName) => {
        var count = getTag_EntryCount(tName)
        var date = await getTag_CreationDate(tName)
        var tag = new Tag(tName,count,date)
        tagsHTML.push(tag.toHTML())
    })
    return tagsHTML
}

/**
 * Get a tally(count) of a tag directories entries.
 * @param tag - name of the tag
 * @returns 
 */
function getTag_EntryCount(tag:string):number {
    var entries = readDir('./tagDirs', tag)
    return entries.length
}
/**
 * Get a Tag's Creation Date as a string (Promise<string>)
 * @param tag - name of the tag
 * @returns 
 */
async function getTag_CreationDate(tag:string):Promise<string> {
    var path = './tagDirs/'+tag
    var {birthtime} = await fs.promises.stat(path)
    var btimeStr = birthtime.toDateString()
    return btimeStr
}