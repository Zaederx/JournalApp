const {contentBridge, ipcRenderer, contextBridge} = require('electron');

contextBridge.exposeInMainWorld('viewAPI', 
{
    changeWindowContent: (channel, windowContent) => {
        if (channel == 'new_content') {
            ipcRenderer.send('new_content', windowContent)
        }
    }
});