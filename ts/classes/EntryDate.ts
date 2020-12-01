/**
 * Has both an Entry file's name and birthtime.
 */
export class EntryDate {
    name:string;
    btime:number;
    /**
     * 
     * @param name name of the entry file
     * @param btime birthtime of the entry file
     */
    constructor(name:string, btime:number) {
        this.name = name;
        this.btime = btime;
    }
}