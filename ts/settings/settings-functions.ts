import fs from 'fs';
import * as dirs from '../directory'
import { Settings, settings } from './settings-type'
import { printFormatted } from '../other/stringFormatting';

/**
 * Write settings to the filesystem.
 * @param settings 
 */
export async function saveSettingsJson(settings:settings) 
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
 */
export async function retrieveSettings(jsonStr:boolean):Promise<string|any>
{
  printFormatted('blue','retrieveSettingsJson called')
  //check if file exists
  try 
  {
    var settingsJson:string = await fs.promises.readFile(dirs.settingsFile, 'utf-8')
    if (jsonStr) { return settingsJson }
    else { return JSON.parse(settingsJson) }//return an object
  }
  catch (error)
  {
    printFormatted('red','error retrieveing settings:',error)
    printFormatted('yellow','Now going to use defaults.')
    saveSettingsJson(Settings.defaults)
  }
  return 'NO FILE FOUND'
}