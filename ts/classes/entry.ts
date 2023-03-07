import dateStr from '../entry/crud/dateStr'
/**
 * Class to describe Journal Entries.
 */
export class Entry {
    date:string;
    title:string;
    body:string;
    tags:string[] = [];
    
    constructor (obj:{ entry?:Entry, e_date?:string, e_title?:string, e_body?:string, e_tags?:string[]}) {
        //if using entry instead
        if (obj?.entry)
        {
            const {date, title, body, tags} = obj.entry
            this.date = date
            this.title = title
            this.body = body
            this.tags = tags
        }
        else
        {
            // regular var assignment
            this.date = obj.e_date ? obj.e_date : dateStr();
            this.title = obj.e_title ? obj.e_title : 'default';
            this.body = obj.e_body ? obj.e_body : 'default';
            this.tags = obj.e_tags ? obj.e_tags : ['all'];
        }
        
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
        var count = 0
        e.tags.forEach((e)=> {
            //start condition - if first iteration - no comma before e
            if (count == 0){
                entryTags += e
                count++
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
        entryTxt += 'Date:'+e.date+'\n'
        entryTxt += 'Title:'+e.title+'\n'
        entryTxt += 'Body:'+e.body+'\n'
        entryTxt += 'Tags:'+e.tagsArrToStringCSV()
        
        return entryTxt
    }
    entryToJson(e:Entry=this)
    {
        var json = {date:e.date, title:e.title, body:e.body, tags:e.tagsArrToStringCSV() }
        return json
    }
    tagsToHTML(tags:string[]) {
        var tagsHtml = ''
        tags.forEach((tag) => {
            tagsHtml += '<div>'+tag+'</div>\n'
        })
        return tagsHtml
    }
}