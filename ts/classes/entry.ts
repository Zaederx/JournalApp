/**
 * Class to describe Journal Entries.
 * Note: you must pass in an object even if it's an empty one, 
 * otherwise it causes problems in the constructor.
 */
export default class Entry {
    date:string;
    title:string;
    body:string;
    tags:string[] = [];

    /**
     * must pass in an object - even if its empty
     */
    constructor (obj:{entry?:Entry, date?:string, title?:string, body?:string, tags?:string[]}={}) {
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
            const { date, title, body, tags } = obj.entry
            this.date = date ? date : dateStr
            this.title = title
            this.body = body
            this.tags = tags
        }
        else
        {
            //regular var assignment
            const { date, title, body, tags } = obj
            this.date = date ? date : dateStr;
            this.title = title ? title : 'default';
            this.body = body ? body : 'default';
            this.tags = tags ? tags : ['all'];
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
        entryTxt += 'Date:'+e.date+'\n'
        entryTxt += 'Title:'+e.title+'\n'
        entryTxt += 'Body:'+e.body+'\n'
        entryTxt += 'Tags:'+e.tagsArrToStringCSV()
        
        return entryTxt
    }
    entryToJson(e:Entry=this)
    {
        var json = {date:e.date, title:e.title, body:e.body, tags:e.tags.toString()}
        return json
    }
    entryToJsonStr(e:Entry=this)
    {
        var jsonStr = JSON.stringify(e)
        return jsonStr
    }
    tagsToHTML(tags:string[], obj?:{tags:string[], tagsStr:string}) {
        var tagsHtml = ''
        //if an array of tags is given
        //return tagsHTML with HTML tag info
        if (tags)
        {
            tags.forEach((tag) => {
                tagsHtml += '<div>'+tag+'</div>\n'
            })
        }
        //if using obj
        else if(obj && obj.tags)
        { 
            //get tags and tagStr from obj
            const { tags, tagsStr } = obj
            //if tags is present - use tags
            if (tags)
            {
                tags.forEach((tag) => {
                    tagsHtml += '<div>'+tag+'</div>\n'
                })
            }
            //else if tagsStr is present use that
            else if (tagsStr)
            {
                var tArr = this.tagsStringToArr(tagsStr)
                tArr.forEach((tag) => {
                    tagsHtml += '<div>'+tag+'</div>\n'
                })
            }
        }
        console.log('tagsHTML:'+tagsHtml)
        return tagsHtml
    }
}