# Things learnt during the making of this project

## forEach loops in javascript are not ASYNC AWAIT aware
You end up getting unpredicatable behaviour when you use promises inside of forEach loops. Use for loops instead.

## Objects created from json don't have functions attached
You need to create a whole new object with the attributes copied accross. Sometmes changing between json strings and objects are unavoidable as in the case of passing objects in electron via the ipcRenderer to main. It doesn't handle complex object types (you have to use json)
Exmaple usage
```
file1.ts
var entryJson = JSON.stringify(entry)

ipcRenderer.invoke('send-something', entryJson)
```

```
main.ts
ipcMain.handle('send-something', (entryJson) => {
    e = JSON.parse(entryJson)
    entry = new Entry(e)
})
```

## To Test Electron Apps - Spectron Deprecation see [article](https://www.electronjs.org/blog/spectron-deprecation-notice) and WDIO see[latest in automated testing](https://www.electronjs.org/docs/latest/tutorial/automated-testing)
As spectron has been deprecated, WDIO is now the official successor to Spectron for automated testing. For getting started with WDIO see [getting started](https://webdriver.io/docs/gettingstarted/) also see [wdio-electron-service](https://github.com/webdriverio-community/wdio-electron-service/blob/main/example/e2e/wdio.conf.js)
  


## Unable to load spec files because they rely on 'browser' object 
see - [stackoverflow link](https://stackoverflow.com/questions/63589090/webdriver-io-unable-to-load-spec-files-quite-likely-because-they-rely-on-brow)
and see - [wdio article](https://webdriver.io/blog/2019/11/01/spec-filtering/)
ans see most importantly [wdio link](https://webdriver.io/docs/api/browser)
In the end it was important to import the browser object into the files. For example:
```
import { browser } from '@wdio/globals'

export default class ViewEntry extends Page
{
    /**
     * Click edit entry button and opens
     * edit entry view
     */
    public async clickEditEntryButton()
    {
        return await browser.$('#update-entry').click()
    }
    
    /**
     * Click delete entry button
     */
    public async clickDeleteEntryButton()
    {
        return await browser.$('#delete-entry').click()
    }
}
```

## Note for setting up port number for wdio using chromedirver with electron service
Important to put the port number twice into the wdio.config.ts file. Once under the electron service `chromedirver:{port:}` and once under the wdio `port` setting.
Please see [wdio-electron-service example](https://github.com/webdriverio-community/wdio-electron-service/blob/main/example/e2e/wdio.conf.js)


## 'Object XX' is undefined - e.g. Entry is undefined.
Make sure to check that the object has been imported. It does not always check types dependent on settings in tsconfig.

## Cannot find module '../folder/xxx', e.g.: Cannot find module '../classes/entry'
Make sure that you do not include imports on files that are script on html. i.e.
```
<head>
    <script>var exports = {"__esModule": true};</script>
    <script src="../js/classes/entry.js" defer></script>//These
    <script src="../js/view/nav.js" defer></script>//are 
    <script src="../js/view/create-entry.js" defer></script>//all
    <script src="../js/view/settings.js" defer></script>//scripts
    <script src="../js/view/export.js" defer></script>// dont include imports when using electron.
    <link id="theme-css" rel="stylesheet" href="../css/main.css">
    <!-- Security meta information - https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <meta http-equiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Journal App</title>
</head>
```

This is error is basically telling you that it can't find the script. Instead, just include the class files or related script as additional scripts in the html.
Looking at the previous example, create-entry.js requires entry.js. So entry is included in the scripts. I put entry above so that its should be loaded first before create-entry.js


## Note - Async await is NOT syntactic sugar for promises - online research + personal observations
You can have instances where async await is not the best choice and standard promises might be the best choice. Things to note:
- Async wait does not work within loops
- Async await is usually best when working with a single promise that returns a result
- Async await It only puts the dependent line - usually the next line - on hold until, but that does not guarantee that all the code you have written will execute in the order you have written it in (best to use... 
```
    var promise = ipcRenderer.invoke('invocation')
    promise.then((object) =>
    {
        //code
        //code
        //code 
    })
    
```
...rather than
```
var variable = await ipcRenderer.invoke('invocation')
console.log(variable)
console.log('When will you be printed????')//code that could be executed before variable code or after - not known. Just depends on how long it takes for invocation to return - psuedo-random
```
...if you have multiple lines that are to be executed)


## ERROR electron-service: error downloading Chromedriver for Electron v^13.1.0
You just need to install the chromedriver using the `electron-chromedriver` and the version of electron that you need to use. For example:
```
npm install electron-chromedriver@13
```
Then include the driver location in the wdio.config.ts like this:
```
services: [
        ['chromedriver',{
            
            appPath: electronAppPath,
            appName: name,
            // appArgs: [],
            chromedriver: {
                port: portNum,
                logFileName: 'wdio-chromedriver.log',//default
                chromedriverCustomPath: require.resolve('chromedriver/bin/chromedriver'),//gives the location of the chromedriver
            },
            electronVersion:electron
        }]
    ],
```

## Docs for the chromedriver service: https://webdriver.io/docs/wdio-chromedriver-service/
Docs for the chromedriver service setup for the wdio.config.ts


## Always put modules inside of separate folders
Always put modules inside of separate folders even if it's just one file. By doing this it makes sure that you can always separate files into smaller sections, but that are all goruped under the same functionality.


## There's a way to import the 'shell' in electron
This might be useful at another point, just in case you might want to use the shell in another way. Just something to note.Already found a way to access terminal commands in electron but this might be more flexible.
```
// import { shell } from 'electron'
```


## Bundler for project - use Webpack instead of tsc-bundler (because tsc-bundler uses AMD)
Typescript bundler uses AMD format for it's output, while Electron requires CommonJS. Use webpack instead.
https://webpack.js.org/guides/getting-started/
https://webpack.js.org/concepts/modules/
https://webpack.js.org/configuration/node/


## Webpack node modules externals
There is a module to exclude electron and other node external modules from webpack module resolution. This will get rid of errors regarding things like the ipcRenderer not being found 
https://www.npmjs.com/package/webpack-node-externals

## Clicking on any part of the screen causes unwanted onclick event
Basically, in my case, it meant that I had more than one object with the same id. The body of the html document and a button. Just have to be extra careful that I don't use the same id with each object.


## There's such as thing as a commonjs2
There isn't much difference between commonjs and commonjs2, but it seems from what I saw online that commonjs2 handles exports differently with a slightly different form. See [link](https://github.com/webpack/webpack/issues/1114#issuecomment-462240689) for the difference

## Electron BrowserWindow Events
A list of electron browserwindow event can be found at [electron events](https://www.electronjs.org/docs/latest/api/browser-window#instance-events)
By browser events I mean the string that is tied to `window.on` or `window.once` methods in order to be triggered by the app during load up.
```
window.on('ready-to-show', () => {
    //code code code
})
```


## Trouble with unrecognised correct export module
Just changed the export from
```
import { module1 } from './module1'
import { module2 } from './module2'
export { module1, module2 }
```
to a default export and let it have the error message... 

```
import { module1 } from './module1'
import { module2 } from './module2'
export default { module1, module2 }
```
Then changing it back to the correct thing.
```
import { module1 } from './module1'
import { module2 } from './module2'
export { module1, module2 }
```

## Better way of setting up main electron app as a TypeScript class
see [example link](https://gist.github.com/DaveMBush/c162912cb1caf5acf4d2f899814deb99#file-electron-main-ts)


## If you are using a more than one layer of try catches
If you find yourself using a try catch within a try catch, you should probably create a separate function that contains the code that has the second try catch.
Code Example: This originally was a bit confusing when I was trying to put the `isThereTheDirectory` functionality within the `setCurrentEntry` function by itself (not wrapped in a function). Just makes things so much neater and clearer.
```
/**
 * Checks whether the current entry directory exists.
 * @return true or false
 */
async function isThereTheDirectory()
{
  var isThere = false
  try {
    var stat = await fs.promises.stat(dirs.currentEntryDir)
  } catch (error) {
    console.log(error)
    return isThere//false
  }
  isThere = true
  return isThere
}
/**
 * Sets the current entry.
 * This method first tries to delete
 * the old 'current entry' and then replace it with
 * the new current entry.
 * @param selectedEntryName entry selected in the panel to be the current entry
 */
export async function setCurrentEntry(selectedEntryName:string):Promise<void>
{
  console.log('function setCurrentEntry called')
  console.log('selectedEntryName:' +selectedEntryName)
  try 
  {
    var directoryExists = await isThereTheDirectory()
    if(directoryExists)//check if there is already and entry
    {
      console.log('"current-entry" directory exists.')
       const { entryExists, currentEntryName } = await isThereAnEntry()
      //if there is a previous 'current entry' - remove it
      if (entryExists)
      {
        //delete the previous symlink
        const path = paths.join(dirs.currentEntryDir, currentEntryName)
        fs.promises.unlink(path)//use unlink instead of rm (rm doesn't always work properly on symlinks and gives a strange error)
      }
    }
    else//if directory doesn't exist
    {
      console.log('"current-entry" directory does not exist.')
      console.log('creating directory "current-entry"...')
      //make the directory
      var madeDir = fs.promises.mkdir(dirs.currentEntryDir)
      madeDir.then(() => {
        console.log('directory "current-entry" created')
      })
    }
    //path to file and path to new symlink
    const pathToSelectedEntry = paths.join(dirs.allEntries, selectedEntryName)
    const pathToNewSymlink = paths.join(dirs.currentEntryDir, selectedEntryName)
    //make the symlink
    var createdSymlink = fs.promises.symlink(pathToSelectedEntry, pathToNewSymlink)
    return createdSymlink
  }
  catch (error)
  {
    console.log('Problem setting current entry:'+ error)
  }
}

```


## If using scripts that have the `defer` keyword on them, don't use window.onload(() => functionCall()) in the script
It seems to cause problems with the order of execution or something and doesn't allow some of the scripts to work. For example:
```
<script src="../js/view/bundle/nav.bundle.js" defer></script>
```
Inside the script, I don't use `window.onload`


## Promises do not mix well with for loops
I had a case where the `for` loop was incrementing inside the promise `then` statement. Weird stuff. Just important to note again. Be careful when you are using promises inside of loops. Undefined behaviour, not just for `forEach`.

## Sending mail in Node.js - Nodemailer
See [link](https://mailtrap.io/blog/sending-emails-with-nodemailer/)


## Make elements wait for click to return data - using promises
see [link](https://www.gimtec.io/articles/convert-on-click-to-promise/)