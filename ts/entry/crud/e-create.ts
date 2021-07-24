import * as fs from 'fs';
import * as eDate from './dateStr';
import * as dir from '../../directory'
import {app} from 'electron'
import paths from 'path'

/**
 * Writes a entry's json to the file system.
 * @param event IpcMainEvent
 * @param entryJson json String of entry details
 */
export async function createEntry(entryJson:string) {
  console.log('ipcMain: Creating new Entry -' + entryJson);
  //create filename
  var fileName:string = eDate.dateStr() + ".json";

  //if directory doesn't exist - create directory
  
  if (!fs.existsSync(dir.allEntries)) {
    fs.promises.mkdir(dir.tagDirectory)
  }

  //store entry_json in directory
  var filepath = paths.join(dir.allEntries,fileName)
  console.warn('createEntry path:', filepath)
  var message
  try {
    await fs.promises.writeFile(filepath,entryJson, 'utf-8')
    message ='File saved successfully'
  } catch (err) {
    message = 'An error occured in saving the new entry:'+err
  }
  //create symlinks at related tag directories
  symlinkEntryFile(entryJson,fileName)

  return message
}

export async function symlinkEntryFile(entryJson:string,filename:string) {
  console.log('*** symlinkEntryFile called ***')
  var entry:Entry = JSON.parse(entryJson)
  var targetFilepath = paths.join(dir.allEntries,filename)
  
  entry.tags.forEach(async (tag: string)=> {
    if (tag != '' && tag != 'all'){
      var symlinkPath = paths.join(dir.tagDirectory,tag, filename)
      console.log('symlinkPath',symlinkPath)
      var error = await fs.promises.symlink(targetFilepath,symlinkPath)
      console.log(error)
    }
  })
}

