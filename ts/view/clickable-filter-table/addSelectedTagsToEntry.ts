import { getSelectedTags } from "./getSelectedTags"

export async function addSelectedTagsToEntry(entryTemp:any, messageDiv:HTMLDivElement, entry_tags:HTMLDivElement, tagTableBody:HTMLTableElement) {
    //get selected tags
    var selectedTags:string[] = getSelectedTags(tagTableBody)
    //create new entry Temp 
    //@ts-ignore
    entryTemp = new Entry({})
    //for each tag - if not already in tags list -> add to list
    var tagSet = new Set(entryTemp.tags)
    selectedTags.forEach (tag => {
        //if has new - don't add, else add newTag to entry.tags
        tagSet.has(tag) ? null : entryTemp.tags.push(tag)
    })
    //display message
    messageDiv.innerText = 'Tags Added'
    //display tags
    //@ts-ignore
    var e = new Entry({})//for access to class methods (not avaiable to converted JSON to Entry)
    var tagsHTML  = e.tagsToHTML(entryTemp.tags)
    console.log('tagHTML:',tagsHTML)
    entry_tags.innerHTML = tagsHTML
}
