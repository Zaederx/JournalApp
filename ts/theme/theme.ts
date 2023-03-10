import path from "path"
import fs from 'fs'
import * as dir from '../directory'
/** Handle CSS Theme Changes */

/**
 * Function to get the current css
 * theme from file
 */
export async function getCurrentCssTheme()
{
    console.log('function getCurrentCssTheme() called')
    console.log('themeFilepath:'+dir.themeFilepath)
    //read file from css directory
    var theme = ''
    try {
        theme = await fs.promises.readFile(dir.themeFilepath, 'utf-8')
        if (!theme)
        {
            theme = '../css/main.css'
        }
    }
    catch (err) {
        console.log(err)
    }
    return theme
}

/**
 * Function to set the current CSS theme
 * into a file.
 * @param theme css theme string
 */
export async function setCurrentCssTheme(theme:string)
{
    console.log('function setCurrentCssTheme(theme:string) called')
    
    //try writing to file
    try {
        fs.promises.writeFile(dir.themeFilepath,theme,'utf-8')
    } 
    //print any exceptions to console
    catch (e) 
    {
        console.log(e)
    }
    
}