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