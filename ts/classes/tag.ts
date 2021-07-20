/**
 * Class to represent Tags.
 */
export class Tag {
    tagname:string;
    entryCount:number|string;
    tagCreationDate:string;

    constructor(tagname:string, entryCount:number|string, tagCreationDate:string) {
        this.tagname = tagname;
        this.entryCount = entryCount;
        this.tagCreationDate = tagCreationDate;
    }

    toHTML() {
        var html = '<tr>\n'+
                        '<td>'+this.tagname+'</td>\n'+
                        '<td>'+this.entryCount+'</td>\n'+
                        '<td>'+this.tagCreationDate+'</td>\n'+
                   '</tr>\n'
        return html
    }
}