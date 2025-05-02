import fs from 'fs';
import * as dirs from '../directory'
import { printFormatted } from '../other/printFormatted';

/**
 * The settings type.
 * A representation of settings to be stored
 * on the filesystem.
 */
export type settings = {'password-protection':'true'|'false', 'password-reminder':'true'|'false'}

/**
 * A class for working with the app settings.
 * Made to be used as a singleton / one instance 
 * of the class (just static methods).
 */
export class Settings {
    //password protection is false by default because there hasnt been a password set
    // but application will prompt the user turn it on and set a password 
    static defaults:settings =  {'password-protection':'false','password-reminder':'true'}

    /**
     * Write settings to the filesystem.
     * Note:Method needs to be static so that
     * it can be called without creating an
     * instance of the class.
     * @param settings 
     */
    static async saveSettingsJson(settings:settings) 
    {
    printFormatted('blue','saveSettingsJson called')
    
    //check if directory exists
    try
    {
        //if it does not throw and error then the directory exists
        fs.stat(dirs.settingsFolder, (error, stat)=>{
        //else it will throw an error
        if (error) {
            printFormatted('red','No directory present. Creating directory...');
            //if it does not exist - make the directory
            fs.mkdir(dirs.settingsFolder, (error) => {
            if (error) throw error
            printFormatted('red','Making directory...')
            })
        }

        printFormatted('green','Stats:',stat)
        })
        
    }
    //if not make directory
    catch(error)
    {
        printFormatted('red',error)
    }
    //prepare setting as json for writing to file
    const json = JSON.stringify(settings)
    printFormatted('green','settings json stringified:'+json)
    //write settings to file
    fs.writeFile(dirs.settingsFile, json, 'utf-8', (error) => {
        if (error) { printFormatted('red',error)}
        else {printFormatted('green','Writing settings to file ...')}
    })
    }

    /**
     * Retrieve settings from the system.
     * jsonStr boolean set to false by default.
     * @param jsonStr - Whether to return the settings as a json string or object. 
     * Selects string if true. Set to false by default. 
     */
    static async retrieveSettings(jsonStr:boolean=false):Promise<string|settings>
    {
    printFormatted('blue','function retrieveSettingsJson called')
    //check if file exists
    try 
    {
        var settingsJsonStr:string = await fs.promises.readFile(dirs.settingsFile, 'utf-8')
        if (jsonStr) { return settingsJsonStr }
        else { return JSON.parse(settingsJsonStr) as settings }//return an object
    }
    catch (error)//if there's no settings
    {
        printFormatted('red','error retrieveing settings:',error)
        printFormatted('yellow','Now going to use defaults.')

        //save default settings
        this.saveSettingsJson(Settings.defaults)
        //return the settings as a string or settings object
        if (jsonStr) { return JSON.stringify(Settings.defaults) }
        else { return Settings.defaults }//

    }
    }
}