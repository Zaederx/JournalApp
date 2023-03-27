import paths from 'path'
import * as dirs from '../../directory'
import fs from 'fs'
import Entry from '../../classes/entry'

/**
 * Sets the current entry.
 * This method first tries to delete
 * the old 'current entry' and then replace it with
 * the new current entry.
 * @param selectedEntryName 
 */
export async function setCurrentEntry(selectedEntryName:string)
{
  console.log('function setCurrentEntry called')
  try 
  {
    //check if directory exists
    var stat = await fs.promises.stat(dirs.currentEntryDir)
    if(stat.isDirectory())
    {
      //get array of filenames from directory (there should only be one)
      var arr = await fs.promises.readdir(dirs.currentEntryDir)
      var currentEntryName = arr[0]
      //delete the previous symlink
      const path = paths.join(dirs.currentEntryDir, currentEntryName)
      fs.promises.rm(path)
    }
    else
    {
      //make the directory
      fs.promises.mkdir(dirs.currentEntryDir)
    }
    //path to file and path to new symlink
    const pathToExistingEntry = paths.join(dirs.allEntries, selectedEntryName)
    const pathToNewSymlink = paths.join(dirs.currentEntryDir, selectedEntryName)
    //make the symlink
    fs.promises.symlink(pathToExistingEntry, pathToNewSymlink)
  }
  catch (error)
  {
    console.log('Problem setting current entry:'+ error)
  }
}

/**
 * Retrieves the current entry.
 * Returns this as a json string or as an {@link Entry} object
 *
 */
export async function getCurrentEntry(json:boolean):Promise<string | Entry>
{
  //retrieve entry string (json) - only entry in the current entry directory
  var arr:string[] = await fs.promises.readdir(dirs.currentEntryDir, 'utf-8')
  var filename = arr[0]
  const path = paths.join(dirs.currentEntryDir, filename)
  const entryJsonStr:string = await fs.promises.readFile(path, 'utf-8')
  if (json)
  {
    return entryJsonStr//entry as a string of json
  }
  else
  {
    var entryObj =  JSON.parse(entryJsonStr)//without the functions
    var entry:Entry = new Entry(entryObj);//entry object complete with functions
    return entry
  }
}

