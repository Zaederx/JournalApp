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
    /** CREATE ENTRY */
    createEntry: (entry) => {
        ipcRenderer.send('e-create', entry)
    },

    createResponse:  (func) => {
            ipcRenderer.on('response-e-create',  (event, message) => {
            func(message);  
            });
    },
    /** READ ENTRY */
    readEntry: (filename) => {
        ipcRenderer.send('e-read',filename);
    },
    readEntryResponse: (func) => {
        ipcRenderer.on('response-e-read', (event, fileContent) => func(fileContent));
    },

    /** UPDATE ENTRY */
    updateEntry: (entry) => {
            ipcRenderer.send('e-update', entry)
    },
    updateEntryResponse: (func) => {
        ipcRenderer.send('response-e-update', (event, message) => func())
    },


    /** DELETE ENTRY */
    deleteEntry: (channel, entry) => {
            ipcRenderer.send('e-delete', entry)
    },
    

    
    /*** ADDTIONAL CRUD  ***/

    /* Reading all tag directories -> directory names
     * note: each dir = one of the topics
     */
    readDirectories: () => {
        ipcRenderer.send('d-read');
    },
    //dirHTML - list of directory name divs -> <div>dirName</div>
    readDResponse: (func) => {
        ipcRenderer.on('response-d-read', (event,dirHTML) => func(dirHTML));
    },

    /* Read Directory's Files (i.e. get all filenames of directory) */
    readDirectoryEntries: (dir) => {
        ipcRenderer.send('de-read', dir);
    },
    //dirHTML - list of directory filename in html divs -> <div>filename</div>
    readDEResponse: (func) => {
        ipcRenderer.on('response-de-read', (event, filesHTML) => func(filesHTML));
    }


    
});



/* Logging API */
contextBridge.exposeInMainWorld('logAPI', 
{
    message: (message) => {
            ipcRenderer.send('console', message);
    }
});