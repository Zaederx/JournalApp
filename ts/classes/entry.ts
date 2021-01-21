/**
 * Class to describe Journal Entries.
 */
class Entry {
    title:string;
    body:string;
    tags:string;
    constructor (title:string, body:string, tags:string) {
        this.title = title;
        this.body = body;
        this.tags = tags;
    }
}