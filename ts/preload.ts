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
    createEntry: async (entryJson:string) => {
        var message = ipcRenderer.invoke('create-entry', entryJson);
        message
    },

    /** READ ENTRY */
    readEntry: async (entry_filename:string) => {
        var message = ipcRenderer.invoke('read-entry',entry_filename);
        return message;
    },

    /** UPDATE ENTRY */
    updateEntry: async (entryJson:string, entry_filename:string) => {
        var message = ipcRenderer.invoke('update-entry', entryJson, entry_filename);
        return message;
    },

    /** Delete Entry */
    deleteEntry: async (entry_filename:string) => {
        var message = ipcRenderer.invoke('delete-entry', entry_filename)
        return message;
    },

    // Other 
    getLastEntry: async () => {
        var entry_json = await ipcRenderer.invoke('get-last-entry')
        return entry_json
    }
})

contextBridge.exposeInMainWorld('View', {
    displayEntryView: async () => {
        var message = await ipcRenderer.invoke('entry-view')
        return message
    },
    createEntryView: async () => {
        var message = await ipcRenderer.invoke('create-entry-view')
        return message
    },
    editEntryVeiw: async () => {
        var message = await ipcRenderer.invoke('edit-entry-view')
        return message
    },
    editTagsView: async () => {
        var message = await ipcRenderer.invoke('edit-tags')
        return message
    }
})



/********* C.R.U.D. API *********/
contextBridge.exposeInMainWorld('CRUD', 
{
    /** CREATE ENTRY */
    createTag: async (entryJson:string) => {
        var message = ipcRenderer.invoke('create-entry', entryJson);
        message
    },

    /** READ ENTRY */
    readAllTags: async (entry_filename:string) => {
        var message = ipcRenderer.invoke('read-tags-directory',entry_filename);
        return message;
    },

    /** UPDATE ENTRY */
    updateEntry: async (entryJson:string, entry_filename:string) => {
        var message = ipcRenderer.invoke('update-entry', entryJson, entry_filename);
        return message;
    },

    /** Delete Entry */
    deleteEntry: async (entry_filename:string) => {
        var message = ipcRenderer.invoke('delete-entry', entry_filename)
        return message;
    }
})