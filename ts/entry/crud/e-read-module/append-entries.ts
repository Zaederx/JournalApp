import { readDirFiles } from './read-dir-files'
import { EventEmitter } from 'events'
import * as process from 'process'//an extension of node:process

/**
 * Append Entries
 * @param dir directory 
 */
export async function appendEntries(dir:string)
{
    var entries = await readDirFiles(dir)
    entries.forEach((entryFilename) => {
        //if .DS_Store or other invisible file - ignore
        if (entryFilename.charAt(0) == '.') {/*Do nothing*/}
        else 
        {
            sendSingleEntry(entryFilename)
        }
    })
}

/**
 * Sends a single entry to frontend
 * see [node docs link](https://nodejs.org/api/child_process.html#subprocesssendmessage-sendhandle-options-callback)
 * @param entryFilename entry's filename
 */
function sendSingleEntry(entryFilename:string)
{
    console.log('function sendSingleEntry called')
    //only if ipc channel is available - send method is available
    if (process.send)
    {
        //message is sent from this (child process)
        //to the parent process
        process.send({entryFilename:entryFilename});
        console.log('sending message')
    }
}