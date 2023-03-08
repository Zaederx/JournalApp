/**
 * Class to describe Journal Entries.
 */
export class Entry {
    date:string;
    title:string;
    body:string;
    tags:string[] = [];
    
    constructor (obj:{ entry?:Entry, e_date?:string, e_title?:string, e_body?:string, e_tags?:string[]}) {
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        var year = d.getFullYear();
        var hour = d.getHours();
        var mins = d.getMinutes();
        var secs = d.getSeconds();

        var dateStr = day + '-' + (month+1) + '-' + year + '-' + hour + '-' + mins + '-' + secs;
        //if using entry instead
        if (obj?.entry)
        {
            const {date, title, body, tags} = obj.entry
            this.date = date ? date : dateStr
            this.title = title
            this.body = body
            this.tags = tags
        }
        else
        {
            // regular var assignment
            const {e_date, e_title, e_body, e_tags} = obj
            this.date = e_date ? e_date : dateStr;
            this.title = e_title ? e_title : 'default';
            this.body = e_body ? e_body : 'default';
            this.tags = e_tags ? e_tags : ['all'];
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
        var firstIteration = true
        e.tags.forEach((e)=> {
            //start condition - if first iteration - no comma before e
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