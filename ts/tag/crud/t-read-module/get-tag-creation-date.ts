import paths from 'path'
import * as fs from 'fs'
/**
 * Get a Tag's Creation Date as a string (Promise<string>)
 * @param tag - name of the tag
 * @returns 
 */
export async function getTagCreationDate(dir:string,tag:string):Promise<string> {
    var path = paths.join(dir,tag)
    var { birthtime } = await fs.promises.stat(path)
    var btimeStr = birthtime.toDateString()
    return btimeStr
}