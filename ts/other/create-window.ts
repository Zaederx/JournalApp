import { BrowserWindow } from 'electron'
import pathsForAppBinaries from './paths-for-app-binaries'
/**
 * Creates a window for the app and returns it
 * @param integration - whether to enable node integration
 * @return BrowserWindow for the app
 */
export default async function createWindow(integration:boolean=true) {

    
  
    var window = new BrowserWindow
      ({
        width: 921,
        height: 600,
        maxWidth: 921,
        maxHeight:600,
        webPreferences:
        {
          // worldSafeExecuteJavaScript: true ,
          contextIsolation: false,//otherwise "WorldSafe".. message still appears
          nodeIntegration: integration,//whether you can access node methods - e.g. requires/ import, anywhere in the app's js - needed for front end scripts to work
          enableRemoteModule: true,//enable ipcRenderer in fround end js to speak directly to ipcMain - no need for preload script
          v8CacheOptions: 'none',//prevents electron's v8 Chromium browser engine from caching
        }
      })
  
  
    window.loadFile('html/create-entry.html');
  
    await window.webContents.executeJavaScript('localStorage.setItem("inDialog","false")')
  
    //Note:don't think it matters but it was... 
    // if (process.env.NODE_ENV === 'test-main') {
    if (process.env.NODE_ENV === 'test') {
      //produce paths for wdio
      window.webContents.openDevTools();
      pathsForAppBinaries()
    }
      
    
    return window
  }