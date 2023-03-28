import { ipcRenderer } from "electron";
import { settings } from "ts/settings/settings-type";



/**
 * Toggle the setting one and off with each switch toggle.
 * @param switchInput the input this is to be used on
 */
export async function toggleSwitchInput(switchInput: HTMLInputElement)
{
    if (switchInput.checked) 
    {
        //activate password in settings json
        setPasswordProtection('true')
    }
    else
    {
        //deactivate password in settings json
        setPasswordProtection('false')
    }
}

/**
 * A function to help turn the password-protection setting on or off.
 * @param bool a string either 'true' or 'false'
 */
async function setPasswordProtection(bool:'true'|'false')
{
    
    try 
    {
        //activate password in settings json
        var settingsJsonStr:string = await ipcRenderer.invoke('get-settings-json')
        //if settings exit
        if (settingsJsonStr) 
        {
            //parse into an object
            var settings:settings = JSON.parse(settingsJsonStr)
            //change settings
            settings['password-protection'] = bool
            //back into json string
            var settingsJson = JSON.stringify(settings)
            ipcRenderer.invoke('set-settings-json', settingsJson)
        }
    }
    catch (error)
    {
        console.warn('Problem setting password protection to '+bool+ ':'+error)
        //if settings don't exist
        var settings:settings = {'password-protection':bool}
        //back into json string
        var settingsJson = JSON.stringify(settings)
        ipcRenderer.invoke('set-settings-json', settingsJson)
    }
    
    
    
        
    
    
    
    
}