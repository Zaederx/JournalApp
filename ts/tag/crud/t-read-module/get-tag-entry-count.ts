import paths from 'path'

import { readDir } from './read-dir'
/**
 * Get a tally(count) of a tag directories entries.
 * @param tag - name of the tag
 * @returns 
 */
export async function getTagEntryCount(dir:string,tag:string):Promise<number> {
    var path = paths.join(dir,tag)
    var entries = await readDir(path)
    return entries.length
}