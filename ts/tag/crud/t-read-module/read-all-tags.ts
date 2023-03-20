import { readTagDir } from '../t-read-module/read-tag-dir'

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