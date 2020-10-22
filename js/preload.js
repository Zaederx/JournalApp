const {contextBridge, ipcRenderer} = require('electron');

// For more on context isolation - https://www.electronjs.org/docs/tutorial/context-isolation
// "The correct way to expose IPC-based APIs would instead be to provide one method per IPC message." - Electon.org
contextBridge.exposeInMainWorld('viewAPI', 
{
    changeWindowContent: (channel, windowContent) => {
        if (channel == 'new_content') {
            ipcRenderer.send('new_content', windowContent)
        }
    }
});

contextBridge.exposeInMainWorld('CRUD', 
{
    createEntry: (channel, entry) => {
        if (channel == 'create_Entry') {
            ipcRenderer.send('create_Entry', entry)
        }
    },
    createresponse:  (channel, func) => {
    if (channel == 'response-c') {
        ipcRenderer.on('response-c',  (event, entry) =>  func(entry));
        //which in this case is the same as win.webContents.send
        }
    },
    readEntry: (channel, entry) => {
        if (channel == 'read_Entry') {
            ipcRenderer.send('read_Entry', entry)
        }
    },
    changeWindowContent: (channel, entry) => {
        if (channel == 'update_Entry') {
            ipcRenderer.send('update_Entry', entry)
        }
    },
    changeWindowContent: (channel, entry) => {
        if (channel == 'delete_Entry') {
            ipcRenderer.send('delete_Entry', entry)
        }
    }
});

contextBridge.exposeInMainWorld('logAPI', 
{
    message: (channel, message) => {
        if (channel == 'console') {
            ipcRenderer.send('console', message)
        }
    }
});