/**
 * Class to describe Journal Entries.
 */
class Entry {
    title:string;
    body:string;
    tags:string[] = [];
    
    constructor (title?:string, body?:string, tags?:string[]) {
        this.title = title ? title : 'default';
        this.body = body ? body : 'default';
        this.tags = tags ? tags : ['all'];
    }

    tagsToStringCSV():string {
        var csv = this ? this.tagsArrToStringCSV()  : 'all'
        return csv
    }
    tagsStringToArr(tagsString:string):string[] {
        var arr:string[] = tagsString.split(',')
        return arr
    }
    tagsArrToStringCSV(tags:string[]=(this.tags)):string {
        var entryTags:string = ''
        var count = 0
        tags.forEach((e)=> {
            if (count == 0){
                entryTags += e
                count++
            }
            else {
                entryTags += ','+e
            }
            
        })
        return entryTags
    }

    entryToTxt()
    {
        var entryTxt = this.title+'\n'
        entryTxt = this.body+'\n'
        entryTxt = this.tagsArrToStringCSV()
        return entryTxt
    }
    entryToJson()
    {
        var json = { title:this.title, body:this.body , tags:this.tagsArrToStringCSV() }
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