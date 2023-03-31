import { ipcRenderer } from "electron";

/** Functions */
export function activate(theme:string) 
{
    console.log('function activate(theme:string) called')
    //activate theme
    document.querySelector('#theme-css')?.setAttribute('href', theme);
    //set current css theme in theme.txt file
    setCurrentCssTheme(theme)
}


//set filepath and filename
// const cssFilepath = path.join('..','..', 'css', 'theme.txt')

/**
 * Function to set the current CSS theme
 * into a file.
 * @param theme css theme string
 */
export function setCurrentCssTheme(theme:string)
{
    console.log('function setCurrentCssTheme')
    ipcRenderer.invoke('set-current-css-theme', theme)
    console.log('setting theme:'+theme)
}

export async function getCurrentCssTheme()
{
    console.log('function getCurrentCssTheme called')
    var theme:string = await ipcRenderer.invoke('get-current-css-theme');
    console.log('getting theme:'+theme)
    return theme
}

/**
 * Function for loading current css
 * theme from file.
 * 
 * For consistency across page loading.
 */
export async function loadCssTheme()
{
   var theme = await getCurrentCssTheme()
   activate(theme)
}

loadCssTheme()