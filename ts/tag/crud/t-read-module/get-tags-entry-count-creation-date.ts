import { readAllTags, getTagEntryCount, getTagCreationDate } from "../t-read"
import { Tag } from '../../../classes/tag'
/**
 * Get an array of tags -> tagname, entry count and 
 * creation date of the tag directory
 */
export async function getTagsEntryCountCreationDate():Promise<string> {
    console.log('*** getTags_EntryCount_CreationDate called ***')
    var tagsHTMLArr:string[] = []
    var tagsStrArr:string[] = await readAllTags()
    console.log('tagsStrArr:',tagsStrArr)
    //for each - get entry count and creation date
     for(var tName of tagsStrArr) {
         console.log('tName:',tName)
        var count = await getTagEntryCount(tName)
        var date = await getTagCreationDate(tName);
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