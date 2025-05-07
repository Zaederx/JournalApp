import { dialog } from 'electron'
import paths from 'path'
import fs from 'fs'
//@ts-ignore
import AdmZip from 'adm-zip'
import {isThereAFileStrict, isThereTheDirectory } from '../../fs-helpers/helpers'
import { printFormatted } from '../../other/printFormatted'
import { readSingleFile } from '../../entry/crud/e-read'
import Entry from '../../classes/entry'


/**
 * @param sourceDir - (source directory) should be the tagDirs directory
 * @param targetDir - (target directory) should be the downloads or another directory where the copy will be stored.
 * Important Note: `all` tag folder is where all entries are stored.
 * Every other tag folder contains just the symlinks to the actual entries in the `all` tag folder.
 */ 
export async function copyFolderEntriesIntoZip(sourceDir:string, targetDir:string)
{
    //create a new zip in memory
    const zip = new AdmZip()
    //get filenames
    var filenames:string[] = await fs.promises.readdir(sourceDir, 'utf-8')

    //for each filenames -> copy entries to the target destination
    filenames.forEach(async (filename) => 
    {
        //get paths of source and export
        var sourceFilepath = paths.join(sourceDir,filename)
        var exportZipPath = paths.join(targetDir,'export.zip')
        //add file to zip in memory - then write to zip
        zip.addLocalFile(sourceFilepath)
        zip.writeZip(exportZipPath)
    })
}

/**
 * @param sourceDir - SOURCE DIRECTORY
 * @param targetDir - TARGET DIRECTORY
 * Important Note: `all` tag folder is where all entries are stored.
 * Every other tag folder contains just the symlinks to the actual entries in the `all` tag folder.
 */ 
export async function symlinkEntries(sourceDir:string, targetDir:string)
{
    printFormatted('blue', 'function symlinkEntries called')
    printFormatted('green', '\n','sourceDir:',sourceDir, '\n', 'targetDir:',targetDir)
    //get filenames
    var filenames:string[] = await fs.promises.readdir(sourceDir, 'utf-8')

    //for each filenames -> copy entries to the target destination
    filenames.forEach(async (filename) => 
    {
        var sourceFilepath = paths.join(sourceDir,filename)
        // var targetFilepath = paths.join(targetDir,filename)
        //`COPYFILE_EXCL` causes the operation to fail if the file already exists
        // fs.promises.copyFile(sourceFilepath, targetFilepath, fs.constants.COPYFILE_EXCL)


        //optionally - create folders and symlinks of those entries
        /* get entry tags */
        var entryJsonStr = await readSingleFile(sourceDir,filename) as string
        // var stringified = JSON.stringify(entryJsonStr)//to make sure it is valid json first
        var entryJsonObj = JSON.parse(entryJsonStr) as Entry//entry with no access to methods
        var entry = new Entry(entryJsonObj)//now an entry with access to entry methods

        printFormatted('green', 'entryJsonObj:',entryJsonObj, '\n',entry)
        /* For each tag - symlink entry */
        entry.tags.forEach(async(tagName) => 
        {
            printFormatted('green', 'tagName:', tagName)
            if (tagName != 'all') 
            {
                    //creating a tag folder 
                    var tagPath = paths.join(targetDir, tagName)
                try
                {
                    await fs.promises.mkdir(tagPath)
                }
                catch(error)
                {
                    printFormatted('yellow', 'Directory alreayd exists at path:',tagPath, '. Error message -', error)
                }
                //create the symlink in that folder
                var symlinkPath = paths.join(tagPath,filename)
                fs.promises.symlink(sourceFilepath, symlinkPath)
            }
        })
    })
}

/**
 * 
 * @param source 
 * @param defaultTarget - where the dialogPath should be open
 */
export async function exportTransferData(source:string, defaultTarget:string) 
{
    printFormatted('blue', 'exportTransferData called')
    //open window to file system + user selects that transfer data - tagDirs folder
    var target = (await dialog.showOpenDialog({ title: 'Select directory for export', buttonLabel:'Select', defaultPath:defaultTarget, properties: ['openDirectory'] })).filePaths[0]
    
    //create a zip in memory
    copyFolderEntriesIntoZip(source,target)
}

/**
 * Import Transfer Data
 * @param dialogPath default path that you want the dialog to file browser to open on
 * @param target the destination that you want to import the data to.
 */
export async function importTransferData(dialogPathDefault:string, target:string) 
{
    printFormatted('blue', 'importTransferData called')
    //open window to file system + user selects that transfer data - tagDirs folder
    var source = (await dialog.showOpenDialog({title:'Select directory to be imported', buttonLabel:'Select', defaultPath:dialogPathDefault, properties:['openFile'] })).filePaths[0]//i.e. `downloads/export.zip` 

    //extract export zip
    const zip = new AdmZip(source)//i.e. `downloads/export.zip` 
    zip.extractAllTo(target)//i.e. `tagDirs/all`

    /** Symlink entries */
    var extractedZipFolder = target //i.e. `tagDirs/all`
    var tagDirPath = paths.join(target,'..')
    await symlinkEntries(extractedZipFolder, tagDirPath)
}

/**
 * Copies a folder and all its contents and subfolders and their contents and subfolders, recursively.
 * @param source the folder you will be getting the tags from - i.e. .../the-journal-app/tagDirs
 * @param target the target folder - i.e. .../downloads/the-journal-app/tagDirs
 * @param symlink whether to symlink
 */
export async function copyFoldersAndContentsRecursively(source:string,target:string) 
{
    //print source and target
    printFormatted('blue', 'function copyFolderAndSymlink called')
    printFormatted('blue', 'source:', source, '\n','target:', target)
    
    //check if folders exists
    var sourceExists = await isThereTheDirectory(source)
    var targetExists = false

    //create folder in target directory
    try 
    {
        //only works if target does not already exist
        fs.promises.mkdir(target)
        targetExists = true
        printFormatted('green', 'target directory being created:'+target)
    } 
    catch (error) 
    {
        printFormatted('yellow', error)
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
            var isFile = await isThereAFileStrict(newSource)
            // var isSymbolicLink = await isThereASymbolicLink(newSource)
            if (isDirectory)//copyFolder
            {
                printFormatted('blue', newSource + 'is a directory')//info
                copyFoldersAndContentsRecursively(newSource, newTarget)
            }
            else if (isFile) //copy file individual file into subfolder (newTarget)
            {
                try 
                {
                    //if newTarget directory does not exist
                    if (!(await fs.promises.stat(target)).isDirectory())
                    {
                        //create newTarget directory
                        fs.promises.mkdir(target, {recursive:true})
                    }

                } 
                catch (error) 
                {
                    printFormatted('red', error)
                } 
                try
                {
                    //`COPYFILE_EXCL` causes the operation to fail if the file already exists
                    fs.promises.copyFile(newSource, newTarget, fs.constants.COPYFILE_EXCL)
                }
                catch (error)
                {
                    printFormatted('red', error)
                }   
            }
        })
        
    }
}