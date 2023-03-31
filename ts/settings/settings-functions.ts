import fs from 'fs';
import * as dirs from '../directory'
import type { settings } from './settings-type'

/**
 * Write settings to the filesystem.
 * @param settings 
 */
export async function saveSettingsJson(settings:settings) 
{
  console.log('%csaveSettingsJson called', 'color:green')
  
  //check if directory exists
  try
  {
    //if it does not throw and error then the directory exists
    fs.stat(dirs.settingsFolder, (error, stat)=>{
      //else it will throw an error
      if (error) {
        console.log('No directory present. Creating directory...');
        //if it does not exist - make the directory
        fs.mkdir(dirs.settingsFolder, (error) => {
          if (error) throw error
          console.log('Making directory...')
        })
       }

      console.log('Stats:'+stat.toString())
    })
    
  }
  //if not make directory
  catch(error)
  {
   console.log(error)
  }
  //prepare setting as json for writing to file
  const json = JSON.stringify(settings)
  console.log('settings json:'+json)
  //write settings to file
  fs.writeFile(dirs.settingsFile, json, 'utf-8', (error) => {
    if (error) { console.log(error)}
    else {console.log('Writing settings to file ...')}
  })
}

/**
 * Retrieve settings from the system.
 */
export async function retrieveSettingsJson(json:boolean):Promise<string|any>
{
  console.log('retrieveSettingsJson called')
  //check if file exists
  try 
  {
    var settingsJson:string = await fs.promises.readFile(dirs.settingsFile, 'utf-8')
    console.log('settingsJson:'+settingsJson)
    if (json) { return settingsJson }
    else { return JSON.parse(settingsJson) }//return an object
  }
  catch (error)
  {
    console.log('error retrieveing settings:'+error)
  }
  return 'NO FILE FOUND'
}