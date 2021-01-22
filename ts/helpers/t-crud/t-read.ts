import * as fs from 'fs';

/**
 * Returns array of `tagDir` contents (not recursively).
 * i.e. only at that immediate folder level - not each of the folders descendants
 * @return directoryContexts
 */
export function readTagDir():string[] {
    var directory:string[] = [];
    try {
        //using readdirSync - blocks IO until the read is done
        directory = fs.readdirSync('tagDirs/', {
            encoding: 'utf8',/* Note: thoguh the default, setting encoding to 'utf8' explicitly informs typescript -> only string[] not string[]|Buffer[] to be returned*/
            withFileTypes: false
        });
    }
    catch (err){
        console.error('Entry folder could not be read');
    }
    return directory;
}

/**
 * Read tagDir but removes files beinging with '.'
 * i.e. .DS_Store or other hidden system files.
 * Note: often better to use readTagDir if intending to later
 * loop or recurse through directory contents (so that 
 * the operation does have to be performed twice)
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