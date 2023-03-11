# Things learnt during the making of this project

## forEach loops in javascript are not ASYNC AWAIT aware
You end up getting unpredicatable behaviour when you use promises inside of forEach loops. Use for loops instead.

## Objects created from json don't have functions attached
You need to create a whole new object with the attributes copied accross. Sometmes changing between json strings and objects are unavoidable as in the case of passing objects in electron via the ipcRenderer to main. It doesn't handle complex object types (you have to use json)
Exmaple usage
```
file1.ts
var entryJson = JSON.stringify(entry)

ipcRenderer.('send-something', entryJson)
```

```
main.ts
ipcMain.('send-something', (entryJson) => {
    e = JSON.parse(entryJson)
    entry = new Entry(e)
})
```

## To Test Electron Apps - see https://www.electronjs.org/docs/latest/tutorial/automated-testing


## Unable to load spec files because they rely on 'browser' object 
see - [stackoverflow link](https://stackoverflow.com/questions/63589090/webdriver-io-unable-to-load-spec-files-quite-likely-because-they-rely-on-brow)
and see - [wdio article](https://webdriver.io/blog/2019/11/01/spec-filtering/)
ans see most importantly [wdio link](https://webdriver.io/docs/api/browser)
In the end it was important to import the browser object into the files. For example:
```
import browser from '@wdio/globals'

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