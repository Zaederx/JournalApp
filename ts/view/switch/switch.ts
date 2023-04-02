import { ipcRenderer } from "electron";
import { Settings, settings } from "../../settings/settings-type";

/**
 * A function to help turn the password-protection setting on or off.
 * @param bool a string either 'true' or 'false'
 */
export async function setPasswordProtection(bool:'true'|'false')
{
    
    try 
    {
        //retrieve settings as json string
        var settingsJsonStr:string = await ipcRenderer.invoke('get-settings-json')
        //if settings exist / not undefined or empty
        if (settingsJsonStr) 
        {
            //parse into an object
            var settings:settings = JSON.parse(settingsJsonStr)
            //change settings
            settings['password-protection'] = bool
            //turn back into json string
            var settingsJson = JSON.stringify(settings)
            //send settings back to main to be saved/persisted
            ipcRenderer.invoke('set-settings-json', settingsJson)
        }
    }
    //if there's an error
    catch (error)
    {
        //log the error
        console.warn('Problem setting password protection to '+bool+ ':'+error)
        //if settings don't exist - use default settings
        var settings:settings = Settings.defaults
        //turn settings into json string
        var settingsJson = JSON.stringify(settings)
        //send to main to be saved /persisted
        ipcRenderer.invoke('set-settings-json', settingsJson)
    }
}