const {contextBridge, ipcRenderer} = require('electron');

// For more on context isolation - https://www.electronjs.org/docs/tutorial/context-isolation
// "The correct way to expose IPC-based APIs would instead be to provide one method per IPC message." - Electon.org


/* View Controller API */
contextBridge.exposeInMainWorld('viewAPI', 
{
    changeWindowContent: (channel, windowContent) => {
        if (channel == 'new_content') {
            ipcRenderer.send('new_content', windowContent)
        }
    }
});


/* C.R.U.D. API */
contextBridge.exposeInMainWorld('CRUD', 
{
    // CREATE
    createEntry: (channel, entry) => {
        if (channel == 'create_Entry') {
            ipcRenderer.send('create_Entry', entry)
        }
    },

    createResponse:  (channel, func) => {
    // if (channel == 'response-c') {
        ipcRenderer.on('response-c',  (event, message) => {
          func(message);  
        });
        //which in this case is the same as win.webContents.send
        // }
    },

    //READ - Directory
    //dir = one of the topics
    readDirectories: (channel, dir) => {
        //TODO: if director is within /entries/*
        //to make sure they don't explore whole file system through the app
        // dirs.forEach(d => {
        //     if (dir == d) {
                //matches entries 
        //     }
        // });

        if (channel == 'read_Directories') {
            ipcRenderer.send('read_Directories', dir);
        }

    },

    readDResponse: (channel, func) => {
        ipcRenderer.on('response-rD', (event,dirHTML) => func(dirHTML));
    }
    ,

    //READ - Entry
    readEntry: (channel, entry) => {
        if (channel == 'read_Entry') {
            ipcRenderer.send('read_Entry', entry)
        }
    },

    //UPDATE - Entry
    updateEntry: (channel, entry) => {
        if (channel == 'update_Entry') {
            ipcRenderer.send('update_Entry', entry)
        }
    },

    //DELETE
    deleteEntry: (channel, entry) => {
        if (channel == 'delete_Entry') {
            ipcRenderer.send('delete_Entry', entry)
        }
    }
});



/* Logging API */
contextBridge.exposeInMainWorld('logAPI', 
{
    message: (channel, message) => {
        if (channel == 'console') {
            ipcRenderer.send('console', message)
        }
    }
});