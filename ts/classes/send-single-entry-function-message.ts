/**
 * Class for representing messages sent from the 
 * `sendSingleEntry` function in `ts/entry/crud/e-read-module/append-entries.ts`
 */
export default class  SendSingleEntryFunctionMessage{
    entryFilename:string
    /**
     * Whether the entry is the first entry to be sent.
     * Important for working out whether or not to 
     * clear entries on the side panel. (if it's the first entry, then the sidepanel needs to be cleared). See nav.ts
     */
    firstEntry:boolean 
    constructor(entryFilename:string,firstEntry:boolean) 
    {
        this.entryFilename = entryFilename
        this.firstEntry = firstEntry
    }
}