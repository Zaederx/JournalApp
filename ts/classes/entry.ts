/**
 * Class to describe Journal Entries.
 * Important Note: Each entry's filename is the
 * creation date (`cdate`) with the file-extension `.json`
 */
export default class Entry {
    cdate:string; //creation date
    udate:string; //edit / updated date
    title:string;
    body:string;
    tags:string[] = [];

    constructor (obj:{cdate?:string, udate?:string, laccess?:string, title?:string, body?:string, tags?:string[]}={}) 
    {
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        var year = d.getFullYear();
        var hour = d.getHours();
        var mins = d.getMinutes();
        var secs = d.getSeconds();

        //month plus 1 (because it's always off by one for some reason)
        // [turns out because it's zero indexed]
        const dateStr = day + '-' + (month+1) + '-' + year + '-' + hour + '-' + mins + '-' + secs;
    
        //regular var assignment (object deconstruction)
        const { cdate, udate, title, body, tags } = obj
        this.cdate = cdate ? cdate : dateStr;
        this.udate = udate ? udate : dateStr;
        this.title = title ? title : 'default';
        this.body = body ? body : 'default';
        this.tags = tags ? tags : ['all'];
    }
    /**
     * Takes an entry's tags and puts them into 
     * a csv (Comma Separated Value) string
     * See class {@link Entry}.
     * @param e - Entry whose tags you are reading
     * @returns 
     */
    tagsToStringCSV(e:Entry=this):string 
    {
        var csv = e ? e.tagsArrToStringCSV() : 'all'
        return csv
    }
    /**
     * Takes a csv string of tags and turns them
     * into an array of tags.
     * See class {@link Entry}.
     * @param tagsStringCSV 
     * @returns 
     */
    tagsStringToArr(tagsStringCSV:string):string[] 
    {
        var arr:string[] = tagsStringCSV.split(',')
        return arr
    }
    /**
     * Takes an array of tags and turn them into
     * a csv (Comma Separated Value) string of tags.
     * The functions uses this instance of an 
     * {@link Entry} by default if not specified.
     * @param e Entry whose tags are to be read
     * @returns 
     */
    tagsArrToStringCSV(e:Entry=this):string
    {
        var entryTags:string = ''
        var firstIteration = true
        e.tags.forEach((e)=> 
        {
            //start condition - if first iteration - no comma before
            if (firstIteration)
            {
                entryTags += e  
                firstIteration = false
            }
            //else comma before e
            else {
                entryTags += ','+e
            }
        })
        return entryTags
    }
    /**
     * Takes an {@link Entry} and creates a string 
     * representation of it.
     * @param e {@link Entry} whose attributes are to be read
     * @returns 
     */
    entryToTxt(e:Entry=this)
    {
        var entryTxt = ''
        entryTxt += 'Creation Date:'+e.cdate+'\n'
        entryTxt += 'Last Updated Date:'+e.udate+'\n'
        entryTxt += 'Title:'+e.title+'\n'
        entryTxt += 'Body:'+e.body+'\n'
        entryTxt += 'Tags:'+e.tagsArrToStringCSV()
        
        return entryTxt
    }

    /**
     * Returns entry as a json string.
     * See class {@link Entry}.
     * @param e entry to be read
     * @returns 
     */
    entryToJsonStr(e:Entry=this)
    {
        var jsonStr = JSON.stringify(e)
        return jsonStr
    }

    /**
     * Returns tags each wrapped in HTML divs
     * (prepared for use on the frontend).
     * See class {@link Entry}
     * @param tags 
     * @returns 
     */
    tagsToHTML(tags:string[],) 
    {
        var tagsHtml = ''
        //if an array of tags is given
        //return tagsHTML with HTML tag info
        if (tags)
        {
            tags.forEach((tag) => 
            {
                //if tag not empty && not hidden file
                if(tag != '' && tag.charAt(0) != '.')//if empty tag - because of known forEach problems
                {
                    tagsHtml += '<div>'+tag+'</div>\n'
                }
            })
        }
        else 
        {
            tagsHtml += '<div>'+'all'+'</div>\n'
        }
        return tagsHtml
    }

    /**
     * Returns entry as a string.
     * See class {@link Entry}
     * @returns entry as a string
     */
    toString() {
        return this.entryToTxt()
    }
}