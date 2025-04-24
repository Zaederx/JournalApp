import paths from 'path'
import * as dirs from '../../directory'
import fs from 'fs'
import Entry from '../../classes/entry'
import * as fs_helpers from '../../fs-helpers/helpers'
import { printFormatted } from '../../other/printFormatted'
import { readDirFilesEntryDate } from '../../entry/crud/e-read'
import EntryDate from 'ts/classes/entry-date'


/**
 * Creates a symlink to an entry of your choice
 * in the current entry folder.
 * @param selectedEntryName name of the selected {@link Entry}
 */
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
 * See class {@link Entry}
 * @param selectedEntryName entry selected in the panel to be the current entry
 */
export async function setCurrentEntry(selectedEntryName:string):Promise<void>
{
  printFormatted('blue','function setCurrentEntry called')
  printFormatted('green','selectedEntryName:' +selectedEntryName)
  try 
  {
    var directoryExists = await fs_helpers.isThereTheDirectory(dirs.currentEntryDir)
    if(directoryExists)//check if the directory for a current entry exists
    {
      printFormatted('green','The "current-entry" directory exists.')
       const { entryExists, currentEntryName } = await fs_helpers.isThereACurrentEntry()
      //if there is a previous 'current entry' - remove it before creating a new symlink
      if (entryExists)
      {
        printFormatted('green','currentEntryName:'+currentEntryName)
        //get entry file path and delete the previous 'current entry' symlink
        const path = paths.join(dirs.currentEntryDir, currentEntryName)
        const symlinkRemoved = fs.promises.unlink(path)//use unlink instead of rm (rm doesn't always work properly on symlinks and gives a strange error)

        /* create symlink for the new current entry 
        in the current entry folder */ 
        symlinkRemoved.then(() =>createCurrentEntrySymlink(selectedEntryName))
      }
      else //just create the symlink
      {
        printFormatted('yellow','A current entry does not exist.')
        printFormatted('white', 'Setting a current entry.')
        createCurrentEntrySymlink(selectedEntryName)
      }
    }
    else //if the 'current entry' directory doesn't exist
    {
      printFormatted('yellow','"current-entry" directory does not exist.')
      console.log('creating directory "current-entry"...')
      //make the 'current entry' directory
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
 * If the parameter `json` is true, entry is returned as json, else it is returned as an Entry.
 * If no
 *
 */
export async function getCurrentEntry(json:boolean):Promise<string | Entry | undefined >
{
  const eCurrentEntryDoesNotExist = 'The "current-entry" directory does not exist'
  const eNoCurrentEntrySet = 'No current entry set.'
  try
  {
    var directoryExists = await fs_helpers.isThereTheDirectory(dirs.currentEntryDir)
    if (!directoryExists) {
      throw new Error(eCurrentEntryDoesNotExist)
    }
    //get the directory's filenames (should only be the current entry)
    var arr:string[] = await fs.promises.readdir(dirs.currentEntryDir, 'utf-8')
    console.log('arr:'+arr)
    //if no entry found - throw an error
    if (arr.length == 0) {
      throw new Error(eNoCurrentEntrySet)
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
    if (error.message == eCurrentEntryDoesNotExist)
    {
      //create directory
      var promise = fs.promises.mkdir(dirs.currentEntryDir)
      promise.then(() => {
        var message = 'Created directory "current-entry".'
        printFormatted('red',message)
      })
    }
    else if (error.message == eNoCurrentEntrySet)
    {
      //get ordered list of entries - latest to oldest
      const entryDates:EntryDate[] = await readDirFilesEntryDate(dirs.allEntries)
      /* set the first entry in the list 
      (latest entry) to the current entry */
      setCurrentEntry(entryDates[0].name+'.json')
    }

  }
  
  
}

