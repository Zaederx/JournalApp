import { ipcRenderer } from "electron"
import { activateLoader, deactivateLoader } from "./loader"
import { makeAllEntriesClickable } from "./clickable"

/**
 * Load entries into sidepanel.
 * Does this by fetching the entries 
 * HTML from ipcMain.
 * 
 * @param loader spinning loader div
 * @param panel_entries side panel of entries
 */
export default async function loadEntries(loader:HTMLDivElement) {
    console.log('loadEntries called')
    activateLoader(loader)
    ipcRenderer.send('list-all-entries-html')
}