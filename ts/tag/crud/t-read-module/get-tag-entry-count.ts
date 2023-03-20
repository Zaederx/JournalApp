import paths from 'path'
import * as dirs from '../../../directory'
import { readDir } from './read-dir'
/**
 * Get a tally(count) of a tag directories entries.
 * @param tag - name of the tag
 * @returns 
 */
export async function getTagEntryCount(tag:string):Promise<number> {
    var path = paths.join(dirs.tagDirectory,tag)
    var entries = await readDir(path)
    return entries.length
}