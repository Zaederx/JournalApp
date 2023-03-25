import { ipcRenderer } from 'electron';


/** Constants */ //these are relative to the html page 'settings.html'
const DARK_THEME = "../css/dark_mode.css"
const DEFAULT_THEME = "../css/main.css"
const LEAFY_THEME = "../css/leafy.css"

/** CSS */

/** Theme Buttons */
var btn_default_theme
var btn_dark_theme
var btn_leafy_theme
//DEFAULT BUTTON
if (document.querySelector('#btn-default-theme'))
{
    btn_default_theme = document.querySelector('#btn-default-theme') as HTMLButtonElement;
    activateButton(btn_default_theme,DEFAULT_THEME)
}
else
{
    btn_default_theme = null;
}
//DARK THEME BUTTON
if (document.querySelector('#btn-dark-theme'))
{
    btn_dark_theme = document.querySelector('#btn-dark-theme') as HTMLButtonElement;
    activateButton(btn_dark_theme,DARK_THEME)
}
else
{
    btn_dark_theme = null;
}

//LEAFY THEME BUTTON
if (document.querySelector('#btn-leafy-theme'))
{
    btn_leafy_theme = document.querySelector('#btn-leafy-theme') as HTMLButtonElement;
    activateButton(btn_leafy_theme,LEAFY_THEME)
}
else
{
    btn_leafy_theme = null;
}

/** Function to set buttons onclick with
 * activate function 
*/
function activateButton(button:HTMLButtonElement, theme:string)
{
    button.onclick = () => activate(theme);
}

/** Functions */
function activate(theme:string) 
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
function setCurrentCssTheme(theme:string)
{
    console.log('function setCurrentCssTheme')
    ipcRenderer.invoke('set-current-css-theme', theme)
    console.log('setting theme:'+theme)
}

async function getCurrentCssTheme()
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
async function loadCssTheme()
{
   var theme = await getCurrentCssTheme()
   activate(theme)
}

loadCssTheme()