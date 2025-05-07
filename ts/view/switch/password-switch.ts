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
        //retrieve settings as a settings object
        var settings:settings = await ipcRenderer.invoke('get-settings')
        //if settings exist / not undefined or empty
        if (settings) 
        {
            //change settings
            settings['password-protection'] = bool

            //send settings back to main to be saved/persisted
            ipcRenderer.invoke('set-settings', settings)
        }
    }
    //if there's an error
    catch (error)
    {
        //log the error
        console.warn('Problem setting password protection to '+bool+ ':'+error)
        //if settings don't exist - use default settings
        var settings:settings = Settings.defaults
        //send to main to be saved /persisted
        ipcRenderer.invoke('set-settings', settings)
    }
}

/**
 * Checks that password protection settings and 
 * then sets the switch to match the settings
 * (whether on or off).
 */
export async function checkPasswordProtection() {
   const settings:settings =  await ipcRenderer.invoke('get-settings')
   const switchInput = document.querySelector('#password-switch-input') as HTMLInputElement
   if (settings["password-protection"] == 'false') {
    //turn switch to off position
    switchInput.checked == false
   }
   else {
    //turn siwtch to on position
    switchInput.checked == true
   }
}
