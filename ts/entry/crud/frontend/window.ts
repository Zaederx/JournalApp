interface Window {
    view: {
        createEntryView: () => Promise<string>,
        displayEntryView: () => Promise<string>,
        editEntryView: () => Promise<string>,
        editTagsView: () => Promise<string>
    },
    entryCRUD: {
        createEntry: (entryJson:string) => Promise<string>;
        readEntry: (filename:string) => Promise<string>;
        updateEntry: (entryJson:string, filename:string) => Promise<string>;
        deleteEntry: (filename:string) => Promise<string>;

        //other 
        getLastEntry:() => Promise<string>;
    },
    tagCRUD: {
        create: (newTagList:string[]) => Promise<string>,
        readAllTags: (func:Function) => Promise<string[]>,
        readTagEntries: (tagname:string) => Promise<string[]>,
        update: (tagName:string, newtagName:string) => Promise<string>,
        delete: (tagname:string) => Promise<string>,
        getTagInfo: () => Promise<string>,
        deleteTags: (tags:string[]) => Promise<string[]>
    }
}