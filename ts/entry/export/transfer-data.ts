import { dialog } from 'electron'
import paths from 'path'
import fs from 'fs'
import { isThereAFile, isThereTheDirectory } from '../../fs-helpers/helpers'
import { printFormatted } from '../../other/stringFormatting'
import { readSingleFile } from '../../entry/crud/e-read'
/**
 * Import Transfer Data
 * @param dialogPath default path that you want the dialog to file browser to open on
 * @param destination the destination that you want to import the data to.
 */
export async function importTransferData(dialogPath:string, destination:string) 
{
    printFormatted('blue', 'importTransferData called')
    //open window to file system + user selects that transfer data - tagDirs folder
    var tagDirsPath = (await dialog.showOpenDialog({title:'Select "tagDirs" directory', defaultPath:dialogPath, properties:['openDirectory'] })).filePaths[0]
    //take the file system address and copy file over to dedicated location
    var symlink = true
    copyFolderAndSymlink(tagDirsPath,destination, symlink)
}

export async function exportTransferData(dialogPath:string, destination:string) 
{
    printFormatted('blue', 'exportTransferData called')
    //open window to file system + user selects that transfer data - tagDirs folder
    var tagDirsPath = (await dialog.showOpenDialog({ title: 'Select "tagDirs" directory', defaultPath: dialogPath, properties: ['openDirectory'] })).filePaths[0]
    //take the file system address and copy file over to dedicated location
    var symlink = false
    copyFolderAndSymlink(tagDirsPath,destination,symlink)
}

/**
 * 
 * @param source the folder you will be getting the tags from - i.e. .../the-journal-app/tagDirs
 * @param target the target folder - i.e. .../downloads/the-journal-app/tagDirs
 * @param symlink whether to symlink
 */
export async function copyFolderAndSymlink(source:string,target:string,symlink:boolean) 
{
    printFormatted('green', 'function copyFolderAndSymlink called')
    printFormatted('blue', 'source:', source, '\n','target:', target)

    /**
     * target folder with a following 
     * tagDirs folder
     */
    
    //check if folders exists
    var sourceExists = await isThereTheDirectory(source)
    var targetExists = false
    //create folder in target directory
    try 
    {
        //only works if target does not already exist
        fs.promises.mkdir(target)
        targetExists = true
    } 
    catch (error) 
    {
        printFormatted('red', error)
    }
    

    
    if (sourceExists && targetExists) 
    {
        //get files
        var files:string[] = await fs.promises.readdir(source, 'utf-8')

        //check if file is not a directory
        files.forEach(async (filename) => {
            var newSource = paths.join(source,filename)
            var newTarget = paths.join(target, filename)
            printFormatted('blue', 'newSource:', newSource, '\n','newTarget:',newTarget)
            var isDirectory = await isThereTheDirectory(newSource)
            var isFile = await isThereAFile(newSource)
            if (isDirectory)//copyFolder
            {
                printFormatted('blue', 'Copying folder...')//info
                copyFolderAndSymlink(newSource, newTarget, symlink)
            }
            if (isFile) //copy file individual file into subfolder (newTarget)
            {
                try 
                {
                    //if newTarget directory does not exist
                    if (!(await fs.promises.stat(target)).isDirectory())
                    {
                        //create newTarget directory
                        fs.promises.mkdir(target, {recursive:true})
                    }
                    
                    //`COPYFILE_EXCL` causes the operation to fail if the file already exists
                    fs.promises.copyFile(newSource, newTarget, fs.constants.COPYFILE_EXCL)

                    //make a new symlink for each file (in case on a different system)
                    readSingleFile(source,filename)
                } 
                catch (error) 
                {
                    printFormatted('red', error)
                }
            }
        })
        
    }
    printFormatted('blue', 'Done copying folder.')
}