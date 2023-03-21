import { readDir } from './read-dir'
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
export function readTagDir(dir:string):Promise<string[]> {
    return readDir(dir)
}