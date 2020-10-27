const {contextBridge, ipcRenderer} = require('electron');

// For more on context isolation - https://www.electronjs.org/docs/tutorial/context-isolation
// "The correct way to expose IPC-based APIs would instead be to provide one method per IPC message." - Electon.org


/* View Controller API */
contextBridge.exposeInMainWorld('viewAPI', 
{
    changeWindowContent: (windowContent) => {
            ipcRenderer.send('new_content', windowContent)
    }
});


/********* C.R.U.D. API *********/
contextBridge.exposeInMainWorld('CRUD', 
{
    /** CREATE entries*/
    createEntry: (entry) => {
        ipcRenderer.send('create_Entry', entry)
    },

    createResponse:  (func) => {
            ipcRenderer.on('response-c',  (event, message) => {
            func(message);  
            });
    },

    /**Reading all tag directories
     * note: each dir = one of the topics
     */
    readDirectories: () => {
        ipcRenderer.send('read_Directories');
    },
    readDResponse: (func) => {
        ipcRenderer.on('response-rD', (event,dirHTML) => func(dirHTML));
    },

    /* Reading Directory's Files */
    readDirectoryFiles: (dir) => {
        ipcRenderer.send('readDirectoryFiles', dir);
    },
    readDFResponse: (func) => {
        ipcRenderer.on('response-rDF', (event, filesHTML) => func(filesHTML));
    },


    /** Read a single file */
    readFile: (filename) => {
        ipcRenderer.send('readFile',filename);
    },

    readFileResponse: (func) => {
        ipcRenderer.on('response-rF', (event, message) => func(message));
    },

    /** READ entries */
    readEntry: (entry) => {
            ipcRenderer.send('read_Entry', entry)
    },

    /** Update entries */
    updateEntry: (entry) => {
            ipcRenderer.send('update_Entry', entry)
    },

    /** Delete entries */
    deleteEntry: (channel, entry) => {
            ipcRenderer.send('delete_Entry', entry)
    }
});



/* Logging API */
contextBridge.exposeInMainWorld('logAPI', 
{
    message: (message) => {
            ipcRenderer.send('console', message);
    }
});