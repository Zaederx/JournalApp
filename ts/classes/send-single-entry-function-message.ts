export default class  SendSingleEntryFunctionMessage{
    entryFilename:string
    firstEntry:boolean
    constructor(entryFilename:string,firstEntry:boolean) 
    {
        this.entryFilename = entryFilename
        this.firstEntry = firstEntry
    }
}