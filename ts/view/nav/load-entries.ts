import { ipcRenderer } from "electron"
import { activateLoader, deactivateLoader } from "./loader"
import { makeAllEntriesClickable } from "./clickable"

/**
 * @param loader spinning loader div
 * @param panel_entries side panel of entries
 */
export default async function loadEntries(loader:HTMLDivElement, panel_entries:HTMLDivElement) {
    console.log('loadEntries called')
    activateLoader(loader)
    var html = await ipcRenderer.invoke('list-all-entries-html')
    panel_entries.innerHTML = html
    console.log('html:',html)
    makeAllEntriesClickable(loader)
    deactivateLoader(loader)
}