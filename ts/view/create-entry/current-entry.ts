import paths from 'path'
import * as dirs from '../../directory'
import fs from 'fs'
import Entry from '../../classes/entry'

/**
 * 
 * @param selectedEntryName 
 */
export function setCurrentEntry(selectedEntryName:string)
{
  console.log('function setCurrentEntry called')
  const removeCurrentEntry = ''
  try 
  {
    //delete current entry 
    if (selectedEntryName == removeCurrentEntry) 
    {
      //delete the symlink
      const path = paths.join(dirs.currentEntryDir,'*')
      fs.promises.rm(path)
    }
    else 
    {
      //make the directory
      fs.promises.mkdir(dirs.currentEntryDir)
      //path to file and path to new symlink
      const pathToExistingEntry = paths.join(dirs.allEntries, selectedEntryName)
      const pathToNewSymlink = paths.join(dirs.currentEntryDir, selectedEntryName)
      //make the symlink
      fs.promises.symlink(pathToExistingEntry, pathToNewSymlink)
    }
  }
  catch (error)
  {
    console.log('Problem setting current entry:'+ error)
  }
}

/**
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

