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


/* C.R.U.D. API */
contextBridge.exposeInMainWorld('CRUD', 
{
    // CREATE
    createEntry: (entry) => {
        ipcRenderer.send('create_Entry', entry)
    },

    createResponse:  (func) => {
            ipcRenderer.on('response-c',  (event, message) => {
            func(message);  
            });
    },

    //READ - Directory
    //dir = one of the topics
    readDirectories: (dir) => {
        //TODO: if director is within /entries/*
        //to make sure they don't explore whole file system through the app
        // dirs.forEach(d => {
        //     if (dir == d) {
                //matches entries 
        //     }
        // });

            ipcRenderer.send('read_Directories', dir);

    },

    readDResponse: (func) => {
        ipcRenderer.on('response-rD', (event,dirHTML) => func(dirHTML));
    }
    ,

    //READ - Entry
    readEntry: (entry) => {
            ipcRenderer.send('read_Entry', entry)
    },

    //UPDATE - Entry
    updateEntry: (entry) => {
            ipcRenderer.send('update_Entry', entry)
    },

    //DELETE
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