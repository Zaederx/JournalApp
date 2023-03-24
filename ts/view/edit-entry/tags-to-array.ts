/**
 * Turns tag divs into an array of elements.
 * Used by the edit entry page. 
 * @param tags tags
 */
export default function tagsToArr(tags:HTMLDivElement) {
    console.log('function tagsToArr called')
    var arr:string[] = []
    //get tag names from tags div
    tags.querySelectorAll('div').forEach( tag => { 
        //add tag names to arr
        if (tag.innerText != '')
        {
            arr.push((tag as HTMLDivElement).innerText)
        }
    })
    //return arr for tag names
    return arr
}