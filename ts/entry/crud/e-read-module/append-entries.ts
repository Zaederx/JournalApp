import { readDirFiles } from './read-dir-files'
import * as process from 'process'//an extension of node:process
import EntryDate from '../../../classes/entry-date'
import fetchBtime from './fetch-btime'
import entryMergeSort from '../../../algorithms/entryMergeSort'

/**
 * Appends entries to the entry list on the frontend.
 * @param dir directory 
 */
export async function appendEntries(dir:string)
{
    //send message to start loader
    startLoader()

    //get all entries
    var entries = await readDirFiles(dir)
    //for all entries -> sort them by file birthtime
    var entryDates:EntryDate[] = []
    entries.forEach((entryFilename) => {
        //add btime to entry and adds to 
        fetchBtime(dir, entryFilename, entryDates)
        entryDates = entryMergeSort(entryDates)
    })

    var firstEntry = true
    //send each entry to front end
    entryDates.forEach((entryDate) => {
        //if .DS_Store or other invisible file - ignore
        const char0 = entryDate.name.charAt(0)
        const name = entryDate.name
        if (char0 == '.' || name == 'undefined') {/*Do nothing*/}
        //send entry
        else 
        {
            //if first entry clear entries - else don't clear entries
            (firstEntry) ? sendSingleEntry(entryDate.name, firstEntry) : sendSingleEntry(entryDate.name, firstEntry)
            firstEntry = false
        }
    })
    //send message to stop loader
    stopLoader()
}

/**
 * Sends a single entry to frontend
 * see [node docs link](https://nodejs.org/api/child_process.html#subprocesssendmessage-sendhandle-options-callback)
 * @param entryFilename entry's filename
 */
function sendSingleEntry(entryFilename:string, firstEntry:boolean)
{
    console.log('function sendSingleEntry called')
    
    //only if ipc channel is available - send method is available
    if (process.send)
    {
        //message is sent from this (child process)
        //to the parent process
        process.send({entryFilename:entryFilename, firstEntry:firstEntry});
        console.log('sending message')
    }
}

function startLoader() 
{
    //send message to start loader
    if (process.send)
    {
        process.send('start-loader')
    }
}

function stopLoader()
{
    //send message to start loader
    if (process.send)
    {
        process.send('stop-loader')
    }
}