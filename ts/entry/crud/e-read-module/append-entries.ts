import { readDirFiles } from './read-dir-files'
import * as process from 'process'//an extension of node:process
import EntryDate from '../../../classes/entry-date'
import fetchBtime from './fetch-btime'
import entryMergeSort from '../../../algorithms/entryMergeSort'
import SendSingleEntryFunctionMessage from '../../../classes/send-single-entry-function-message'

/**
 * Appends entries to the entry list on the frontend.
 * Does this by sending a message on this child process
 *  which can be accessed from the main process which called it
 * @param dir directory 
 */
export async function appendEntries(dir:string)
{
    //send message to start loader
    startLoader()

    //get all entries
    var entries = await readDirFiles(dir)

    //if there are no entries - send message to clear panel and have no entries
    if (entries.length == 0) 
    {
        const entryFilename = 'NO-ENTRIES'
        const firstTag = true
        sendSingleEntry(entryFilename, firstTag)
    }
    else 
    {
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
            if (char0 != '.' || name != 'undefined')
            //send entry
            {
                //if first entry clear entries - else don't clear entries
                (firstEntry) ? sendSingleEntry(entryDate.name, firstEntry) : sendSingleEntry(entryDate.name, firstEntry)
                firstEntry = false
            }
        })
    }
    //send message to stop loader
    stopLoader()
}

/**
 * Sends a single entry to frontend
 * where it will be displayed.
 * see [node docs link](https://nodejs.org/api/child_process.html#subprocesssendmessage-sendhandle-options-callback)
 * @param entryFilename entry's filename
 */
function sendSingleEntry(entryFilename:string, firstEntry:boolean)
{
    console.log('function sendSingleEntry called')
    
    //only if ipc channel is available - send method is available
    if (process.send)
    {
        /** Message sent on the child process,
         * which can be accessed on the main process that called it by the`childProcess.on` method.
         */
        process.send(new SendSingleEntryFunctionMessage(entryFilename,firstEntry));
        console.log('sending message')
    }
}

/**
 * Sends a message from this process to the
 * main process to start the loader animation.
 */
function startLoader() 
{
    //send message to start loader
    if (process.send)
    {
        process.send('start-loader')
    }
}

/**
 * Sends a message from this process to the
 * main process to stop the loader animation.
 */
function stopLoader()
{
    //send message to start loader
    if (process.send)
    {
        process.send('stop-loader')
    }
}