import c_process from 'child_process'
import { IpcMainEvent } from 'electron'
import * as dirs from '../../directory'

/**
 * Append entries and tags.
 * @param event 
 */
export function appendEntriesAndTags(event:IpcMainEvent)
{
  console.log('window ready-to-show called')
    //fetch addresses
    const { allEntries, tagDirectory } = dirs
    //create a child process that fills the side panel with entries and tags
    var childProcess = c_process.spawn('node', ['js/append.js', allEntries, tagDirectory], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })
    //if successful in creating child process..
    if (childProcess) {
      //replt to the event with...
      childProcess.on('message', (message: any) => {
        if (message.entryFilename) {
          //the entry filename
          console.log('message.entryFilename -> present')
          event.reply('recieve-entry-filename', message)
        }
        else if (message.tagDirname) {
          //the tagDirname - relates to nav.ts
          console.log('message.tagDirname -> present')
          event.reply('recieve-tag-dirname', message)
        }
        else if (message == 'start-loader') {
          event.reply(message)
        }
        else if (message == 'stop-loader') {
          event.reply(message)
        }
      })
    }
}