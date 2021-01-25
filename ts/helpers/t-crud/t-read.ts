import * as fs from 'fs';
import * as dir from '../directory';
import * as eSort from '../algorithms/entrysort'
import {readDirFiles} from '../e-crud/e-read';

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
    return readDir(dir.tagDirectory);
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
        var directory = fs.readdirSync(dir+'/'+and, {
            encoding: 'utf8',/* Note: thoguh the default, setting encoding to 'utf8' explicitly informs typescript -> only string[] not string[]|Buffer[] to be returned*/
            withFileTypes: false
        });
    }
    catch (err){
        console.error('Entry folder could not be read');
    }
    return directory;
}