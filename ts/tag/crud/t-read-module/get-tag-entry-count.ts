import paths from 'path'
import { printFormatted } from '../../../other/printFormatted'
import { readDir } from './read-dir'
/**
 * Get a tally(count) of a tag directories entries.
 * @param tag - name of the tag
 * @returns 
 */
export async function getTagEntryCount(dir:string,tag:string):Promise<number> {
    printFormatted('blue', 'function getTagEntryCount called')
    var path = paths.join(dir,tag)
    var entriesAndHidden = await readDir(path)
    var entries:string[] = []
    entriesAndHidden.forEach((filename) =>
    {
        printFormatted('yellow', 'filename:',filename)
        if (filename.charAt(0) != '.')//if not hidden file
        {
            entries.push(filename)
        } 
    })
    printFormatted('green', 'entry count:', entries.length)
    return entries.length
}