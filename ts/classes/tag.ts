/**
 * Class to represent Tags.
 */
class Tag {
    tagname:string;
    entryCount:number;
    tagCreationDate:number;

    constructor(tagname:string, entryCount:number, tagCreationDate:number) {
        this.tagname = tagname;
        this.entryCount = entryCount;
        this.tagCreationDate = tagCreationDate;
    }
}