interface Window {
    logAPI: { 
        message: (message: string) => void; 
    }
    CRUD: {
        createEntry: (entryJson:string) => void;
        createEntryResponse: (func: Function) => void;
        readEntry: (filename:string) => void;
        readEntryResponse: (func:Function) => void;
        updateEntry: (entryJson:string, filename:string) => void;
        updateEntryResponse: (func:Function) => void;
        deleteEntry: (filename:string) => void;
        deleteEntryResponse: (func:Function) => void;

        readTags: () => void;
        readTResponse: (func:Function) => void;
        readTagDirectory: (dir:string) => void;
        readTDResponse: (func:Function) => void;
    }
    tagCRUD: {
        create: (newTagList:string[]) => void,
        createR: (func:Function) => void,
        createPromise: (newTagList:string[],func:Function) => void,
        readAllTags: (func:Function) => string[],
        readTagEntries: (tagname:string) => void,
        readTagEntriesR: (func:Function) => void,
        update: (tagName:string, newtagName:string) => string,
        updateR: (func:Function) => void,
        delete: (tagname:string) => void,
        deleteR: (func:Function) => void,
        getTagInfo: () => Promise<string>,
        deleteTags: (tags:string[]) => Promise<string[]>
    }
}