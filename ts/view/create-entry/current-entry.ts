import paths from 'path'
import * as dirs from '../../directory'
import fs from 'fs'
import Entry from '../../classes/entry'
import * as fs_helpers from '../../fs-helpers/helpers'
import { printFormatted } from '../../other/stringFormatting'



function createCurrentEntrySymlink(selectedEntryName:string) {
  //path to file and path to new symlink
  const pathToSelectedEntry = paths.join(dirs.allEntries, selectedEntryName)
  const pathToNewSymlink = paths.join(dirs.currentEntryDir, selectedEntryName)
  try 
  {
    //make the symlink
    var createdSymlink = fs.promises.symlink(pathToSelectedEntry, pathToNewSymlink)
    createdSymlink.then(() => {
      printFormatted('green','symlink was created in current entry folder.')
    })
  }
  catch (error:any)
  {
    printFormatted('red', error.message)
  }
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
  printFormatted('blue','function setCurrentEntry called')
  printFormatted('green','selectedEntryName:' +selectedEntryName)
  try 
  {
    var directoryExists = await fs_helpers.isThereTheDirectory(dirs.currentEntryDir)
    if(directoryExists)//check if there is already and entry
    {
      printFormatted('green','The "current-entry" directory exists.')
       const { entryExists, currentEntryName } = await fs_helpers.isThereACurrentEntry()
      //if there is a previous 'current entry' - remove it
      if (entryExists)
      {
        printFormatted('green','currentEntryName:'+currentEntryName)
        //delete the previous symlink
        const path = paths.join(dirs.currentEntryDir, currentEntryName)
        const symlinkRemoved = fs.promises.unlink(path)//use unlink instead of rm (rm doesn't always work properly on symlinks and gives a strange error)
        symlinkRemoved.then(() =>createCurrentEntrySymlink(selectedEntryName))
      }
      else 
      {
        printFormatted('yellow','A current entry does not exist.')
        printFormatted('white', 'Setting a current entry.')
        createCurrentEntrySymlink(selectedEntryName)
      }
    }
    else//if directory doesn't exist
    {
      printFormatted('yellow','"current-entry" directory does not exist.')
      console.log('creating directory "current-entry"...')
      //make the directory
      var madeDir = fs.promises.mkdir(dirs.currentEntryDir)
      madeDir.then(() => {
        console.log('directory "current-entry" created')
      })
    }
  }
  catch (error)
  {
    printFormatted('red','Problem setting current entry:'+ error)
  }
}

/**
 * Retrieves the current entry.
 * Returns this as a json string or as an {@link Entry} object
 *
 */
export async function getCurrentEntry(json:boolean):Promise<string | Entry | undefined >
{
  
  try
  {
    var directoryExists = await fs_helpers.isThereTheDirectory(dirs.currentEntryDir)
    if (!directoryExists) {
      throw new Error('The "current-entry" directory does not exist')
    }
    //get the directory's filenames (should only be the current entry)
    var arr:string[] = await fs.promises.readdir(dirs.currentEntryDir, 'utf-8')
    console.log('arr:'+arr)
    //if no entry found - throw an error
    if (arr.length == 0) {
      throw new Error('No current entry set.')
    }
    //else return the current entry
    else
    {
      var filename = arr[0]//current entry filename
      const path = paths.join(dirs.currentEntryDir, filename)
      const entryJsonStr:string = await fs.promises.readFile(path, 'utf-8')
      //return as json string 
      if (json)
      {
        return entryJsonStr//entry as a string of json
      }
      //or as js object
      else
      {
        var entryObj =  JSON.parse(entryJsonStr)//without the functions
        var entry:Entry = new Entry(entryObj);//entry object complete with functions
        return entry
      }
    }
  }
  catch (error:any)
  {
    if (error.message == 'The "current-entry" directory does not exist')
    {
      //create directory
      var promise = fs.promises.mkdir(dirs.currentEntryDir)
      promise.then(() => {
        var message = 'Created directory "current-entry".'
        console.log(message)
      })
    }
    else if (error.message == 'No current entry set.')
    {
      //TODO SET CURRENT ENTRY
    }

  }
  
  
}

