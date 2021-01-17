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

        readDirectories: () => void;
        readDResponse: (func:Function) => void;
        readDirectoryEntries: (dir:string) => void;
        readDEResponse: (func:Function) => void;
    }
    tagCRUD: {
        create: (tagname:string) => void,
        createR: () => void,
        read: (tagname:string) => void,
        readR: () => void,
        update: (tagname:string) => void,
        updateR: () => void,
        delete: (tagname:string) => void,
        deleteR: () => void
    }
}