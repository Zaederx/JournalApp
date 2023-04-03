/**
 * Class to describe Journal Entries.
 * Note: you must pass in an object even if it's an empty one, 
 * otherwise it causes problems in the constructor.
 */
export default class Entry {
    cdate:string; //creation date
    udate:string; //edit / updated date
    title:string;
    body:string;
    tags:string[] = [];

    /**
     * must pass in an object - even if its empty
     */
    constructor (obj:{cdate?:string, udate?:string, laccess?:string, title?:string, body?:string, tags?:string[]}={}) {
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        var year = d.getFullYear();
        var hour = d.getHours();
        var mins = d.getMinutes();
        var secs = d.getSeconds();

        const dateStr = day + '-' + (month+1) + '-' + year + '-' + hour + '-' + mins + '-' + secs;
    
        //regular var assignment
        const { udate, cdate, title, body, tags } = obj
        this.cdate = cdate ? cdate : dateStr;
        this.udate = udate ? udate : dateStr;
        this.title = title ? title : 'default';
        this.body = body ? body : 'default';
        this.tags = tags ? tags : ['all'];
    }
    tagsToStringCSV(e:Entry=this):string {
        var csv = e ? e.tagsArrToStringCSV() : 'all'
        return csv
    }
    tagsStringToArr(tagsString:string):string[] {
        var arr:string[] = tagsString.split(',')
        return arr
    }
    tagsArrToStringCSV(e:Entry=this):string {
        var entryTags:string = ''
        var firstIteration = true
        e.tags.forEach((e)=> {
            //start condition - if first iteration - no comma before
            if (firstIteration){
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
    entryToJsonObj(e:Entry=this)
    {
        var json = {cdate:e.cdate, title:e.title, body:e.body, tags:e.tags.toString()}
        return json
    }
    entryToJsonStr(e:Entry=this)
    {
        var jsonStr = JSON.stringify(e)
        return jsonStr
    }
    tagsToHTML(tags:string[],) {
        var tagsHtml = ''
        //if an array of tags is given
        //return tagsHTML with HTML tag info
        if (tags)
        {
            tags.forEach((tag) => {
                //if tag not empty && not hidden file
                if(tag != '' && tag.charAt(0) != '.')//if empty tag - because of known forEach problems
                {
                    tagsHtml += '<div>'+tag+'</div>\n'
                }
            })
        }
        return tagsHtml
    }
}