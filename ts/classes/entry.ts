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
        var csv = this ? this.arrToStringCSV()  : 'all'
        return csv
    }
    stringToArr(tagsString:string):string[] {
        var arr:string[] = tagsString.split(',')
        return arr
    }
    arrToStringCSV(tags:string[]=(this.tags)):string {
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
    tagsToHTML(tags:string[]) {
        var tagsHtml = ''
        tags.forEach((tag) => {
            tagsHtml += '<div>'+tag+'</div>\n'
        })
        return tagsHtml
    }
}