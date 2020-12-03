import {contextBridge, ipcRenderer} from 'electron';

// For more on context isolation - https://www.electronjs.org/docs/tutorial/context-isolation
// "The correct way to expose IPC-based APIs would instead be to provide one method per IPC message." - Electon.org


/* View Controller API */
contextBridge.exposeInMainWorld('viewAPI', 
{
    changeWindowContent: (htmlFilename:string) => {
            ipcRenderer.send('new_content', htmlFilename);
    }
});

//idea - api for settings.json could go here later

/********* C.R.U.D. API *********/
contextBridge.exposeInMainWorld('CRUD', 
{
    /** CREATE ENTRY */
    createEntry: (entryJson:string) => {
        ipcRenderer.send('e-create', entryJson);
    },

    createEntryResponse:  (func:Function) => {
            ipcRenderer.on('response-e-create',  (event, message) => {
            func(message);  
            });
    },
    /** READ ENTRY */
    readEntry: (filename:string) => {
        ipcRenderer.send('e-read',filename);
    },
    readEntryResponse: (func:Function) => {
        ipcRenderer.on('response-e-read', (event, fileContent) => func(fileContent));
    },

    /** UPDATE ENTRY */
    updateEntry: (entryJson:string, filename:string) => {
            ipcRenderer.send('e-update', entryJson, filename);
            console.log('updateEntry called');
    },
    updateEntryResponse: (func:Function) => {
        ipcRenderer.send('response-e-update', (event, message) => func(message))
    },


    /** DELETE ENTRY */
    deleteEntry: (filename:string) => {
            ipcRenderer.send('e-delete', filename);
            console.log('deleteEntry function activated')
    },
    
    deleteEntryResponse: (func:Function) => {
        ipcRenderer.on('response-e-delete', (event, message) => func(message))
    },

    
    /*** ADDTIONAL CRUD  ***/

    /* Reading all tag directories -> directory names
     * note: each dir = one of the topics
     */
    readDirectories: () => {
        ipcRenderer.send('d-read');
    },
    //dirHTML - list of directory name divs -> <div>dirName</div>
    readDResponse: (func:Function) => {
        ipcRenderer.on('response-d-read', (event,dirHTML) => func(dirHTML));
    },

    /* Read Directory's Files (i.e. get all filenames of directory) */
    readDirectoryEntries: (dir:string) => {
        ipcRenderer.send('de-read', dir);
    },
    //dirHTML - list of directory filename in html divs -> <div>filename</div>
    readDEResponse: (func:Function) => {
        ipcRenderer.on('response-de-read', (event, filesHTML) => func(filesHTML));
    }


    
});


/* Logging API */
contextBridge.exposeInMainWorld('logAPI', 
{
    message: (message:string) => {
            ipcRenderer.send('console', message);
    }
});

//https://github.com/electron-userland/spectron/tree/c527b4e5fd8ab89ed0c6454a4dfb69f0980e9e1d#node-integration
// This is only required if your tests are accessing any Electron APIs. You don't need to do this if you are only accessing the helpers on the client property which do not require Node integration.
// Needed if testing 
// if (process.env.NODE_ENV === 'test') {
//     window.electronRequire = require
//   }

if (process.env.NODE_ENV === 'test') {
    const test = require('../test/test-modules');
    contextBridge.exposeInMainWorld('test', 
    {
        isViewHidden: (viewId:string) => test.isViewHidden(viewId),
        sleep : (ms:number) => test.sleep(ms),
    });
}