const {contentBridge, ipcRenderer, contextBridge} = require('electron');

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
        if (channel == 'new_content') {
            ipcRenderer.send('new_content', entry)
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