interface Window {
    logAPI: { 
        message: (message: string) => void; 
    }
    CRUD: {
        createEntry: (entryJson:string) => void;
        createEntryResponse: Function;
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
}