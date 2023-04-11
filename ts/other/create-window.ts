import { BrowserWindow } from 'electron'
import pathsForWDIO from './paths-for-wdio'
export default async function createWindow(integration:boolean) {

    
  
    var window = new BrowserWindow
      ({
        width: 921,
        height: 600,
        minWidth: 921,
        minHeight: 478,
        webPreferences:
        {
          // worldSafeExecuteJavaScript: true ,
          contextIsolation: false,//otherwise "WorldSafe".. message still appears
          nodeIntegration: true,//whether you can access node methods - e.g. requires/ import, anywhere in the app's js - needed for front end scripts to work
          enableRemoteModule: true,//enable ipcRenderer in fround end js to speak directly to ipcMain - no need for preload script
          v8CacheOptions: 'none',//prevents electron's v8 Chromium browser engine from caching
        }
      })
  
  
    window.loadFile('html/create-entry.html');
  
    await window.webContents.executeJavaScript('localStorage.setItem("inDialog","false")')
  
    if (process.env.NODE_ENV === 'test-main') {
      //produce paths for wdio
      window.webContents.openDevTools();
      pathsForWDIO()
    }
      
    
    return window
  }