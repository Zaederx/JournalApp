/**
 * Class to describe Journal Entries.
 */
class Entry {
    title:string;
    body:string;
    tags:string[];
    
    constructor (title?:string, body?:string, tags?:string[]) {
        this.title = title ? title : 'default';
        this.body = body ? body : 'default';
        this.tags = tags ? tags : [];
    }

    tagsToStringCSV():string {
       return this.arrToStringCSV(this.tags!)//TODO add saftey measure
    }
    stringToArr(tagsString:string):string[] {
        var arr:string[] = tagsString.split(',')
        return arr
    }
    arrToStringCSV(tags:string[]) {
        var entryTags:string = ''
        var count = 0
        tags.forEach((e)=> {
            if (count == 0){
                entryTags += e
            }
            else {
                entryTags += ','+e
            }
            
        })
        return entryTags
    }
}