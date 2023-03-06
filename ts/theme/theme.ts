import path from "path"
import fs from 'fs'
/** Handle CSS Theme Changes */
const cssFilepath = path.join('css', 'theme.txt')
/**
 * Function to get the current css
 * theme from file
 */
export async function getCurrentCssTheme()
{
    console.log('function getCurrentCssTheme() called')
    //read file from css directory
    var theme = await fs.promises.readFile(cssFilepath, 'utf-8')
    return theme
}

/**
 * Function to set the current CSS theme
 * into a file.
 * @param theme css theme string
 */
export async function setCurrentCssTheme(theme:string)
{
    console.log('function setCurrentCSSTheme(theme:string) called')
    
    //try writing to file
    try {
        fs.promises.writeFile(cssFilepath,theme,'utf-8')
    } 
    //print any exceptions to console
    catch (e) 
    {
        console.log(e)
    }
    
}