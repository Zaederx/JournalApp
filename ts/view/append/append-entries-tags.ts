import c_process from 'child_process'
import { IpcMainEvent } from 'electron'
import * as dirs from '../../directory'
import { printFormatted } from '../../other/stringFormatting'
import paths from 'path'

/**
 * Append entries and tags.
 * @param event 
 * @param allEntries path to 'all' entries tag folder
 * @param tagDirectory path to tag directory 'tagDirs'
 */
export function appendEntriesAndTags(event:IpcMainEvent, allEntries:string, tagDirectory:string)
{
  printFormatted('blue','window ready-to-show-sidepanel called')
    //fetch addresses

    //create a child process that fills the side panel with entries and tags
    var pathToAppendJS = paths.join(__dirname, 'append.js')
    console.log('pathToAppendJS:'+pathToAppendJS)
    var childProcess = c_process.fork(pathToAppendJS,[ allEntries, tagDirectory], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })
    
    //if successful in creating child process..
    if (childProcess) 
    {
      try
      {

        childProcess.stderr?.on('data', (data) => {
          console.log('data:',data)
        })
        childProcess.on('error', (error) => {
          throw error
        })
        childProcess.on('exit', (code,signal) => {
          printFormatted('yellow', 'exit code: ', code, '\nsignal:',signal)
        })
        //reply to the event with...
        childProcess.on('message', (message:any) => 
        {
          if (message.entryFilename) 
          {
            //the entry filename
            console.log('message.entryFilename -> present')
            event.reply('recieve-tag-entries', message)
          }
          else if (message.tagDirname) 
          {
            //the tagDirname - relates to nav.ts
            console.log('message.tagDirname -> present')
            event.reply('recieve-tag-dirname', message)
          }
          else if (message == 'start-loader') 
          {
            event.reply('activate-loader')
          }
          else if (message == 'stop-loader') 
          {
            event.reply('deactivate-loader')
          }
        })
      }
      catch(error)
      {
        printFormatted('red', 'Error in append-entries-tags.ts:', error)
      }
    }
}