//variables

import paths from 'path';
import * as fs from 'fs';
import * as dir from '../../directory';
import path from 'path';
//@ts-ignore //TODO
import { Entry } from '../../classes/entry';
 
/**
 * NOTE: For each loops do not support async await
 */

//functions
/**
 * Retrieve entry from filesystem by giving
 * the entry filename
 * @param entry_name entry filename
 */
export async function getEntry(entry_name: string)
{
    var filepath = paths.join(dir.tagDirectory, entry_name)
    var entryStr:string = await fs.promises.readFile(filepath,'utf-8')
    var entry:Entry = JSON.parse(entryStr)
    return entry
}
/**
 * Retrieve an entry from filesystem by using
 * a filepath
 * @param filepath filepath of a given entry
 */
async function getEntryByFilepath(filepath: string)
{
    console.log('\nfunction getEntryByFilepath is called')
    console.log('filepath:'+filepath)
    var entry:Entry|undefined = undefined
    try {
        var promise = fs.promises.readFile(filepath,'utf-8')
        return promise.then((entryStr:string) => {
            console.log('entryStr:'+entryStr)
            entry = JSON.parse(entryStr)
            console.log('entry:'+entry)
            return entry
        })
        
    } catch (error) {
        console.warn(error)
    }
    
    return entry
}

/**
 * Retrieve an array of Entries from file
 * system json entry files
 * @param entriesFilepathsArr array of filepaths for entries
 */
async function getEntriesByFilepaths(entriesFilepathsArr:string[]):Promise<Entry[]>
{
    console.log('\nfunction getEntriesByFilepaths called')
    var entries:Entry[] = []
    for (var i = 0; i < entriesFilepathsArr.length; i++) 
    {
        //get filepath
        var filepath = entriesFilepathsArr[i]
        //get entry by filepath
        var entry = await getEntryByFilepath(filepath);
        //add entry to list of entries
        entry ? entries.push(entry) : console.log('entry is undefined')
        console.log('entries',entries)
    } 
    
    return entries
}

/**
 * Export an entry as a plain text file
 * @param entry_name name of an entry
 */
export async function exportEntryTxt(entry_name:string)
{
    var entry = await getEntry(entry_name)
    var txt:string = entry.entryToTxt()
    return txt
}

/**
 * Export entries as txt files
 * @param entriesFilepathsArr filepaths of entries to be exported
 * @return string[] of txt
 */
export async function exportEntriesTxt(entriesFilepathsArr:string[])
{
    console.log('\nfunction exportEntriesTxt called\n')
    //get entries
    var entries = await getEntriesByFilepaths(entriesFilepathsArr)
    console.log('getEntriesByFilename():'+entries.toString())
    
    //get file directory path
    var exportDir = path.join(dir.downloads, 'journal-app-export')
    console.log('exportDir:'+exportDir)

    //create directory
    try 
    {
        var exportDirExists:boolean = (await fs.promises.stat(exportDir)).isDirectory()
        if(!exportDirExists)
        {
            console.log('making export directory:'+exportDir)
            fs.promises.mkdir(exportDir)
        }
        else
        {
            console.warn('export directory already exists')
        }
        //entries to filesystem
        entries.forEach( async (entry) => {
            console.log('entry.title:'+entry.title)
            //set filepath
            var filepath = path.join(exportDir, entry.date + '.txt')
            console.log('export filepath:', filepath)
            try {
                //get entry as txt output
                var obj = {entry:entry}
                var e = new Entry(obj)
                var txt = e.entryToTxt()
                console.log('entry txt output'+ txt)
                //write file to directory
                await fs.promises.writeFile(filepath, txt, 'utf-8')
            } catch (error) {
                console.warn(error)
            }
        })
    }
    catch (err) 
    {
        console.warn('directory already exists:',err)
    }
    
    
}



/**
 * Export an entry as a json file
 * using the entry's name
 * @param entry_name name of entry 
 */
export async function exportEntryJson(entry_name:string)
{
    var entry = await getEntry(entry_name)
    var json = entry.entryToJson()
    return json
}


export async function exportEntriesJson(entriesFilepathsArr:string[])
{
    //get entries
    var entries:Entry[] = await getEntriesByFilepaths(entriesFilepathsArr)

    //entries to txt
    type entryJson = {title:string, body:string, tags:string}
    var jsonArr:entryJson[] = []
    entries.forEach( entry => 
        {
            jsonArr.push(entry.entryToJson())
        })
    //return txt files in array
    return jsonArr
}


/**
 * 
 * @param entriesFilepathsArr array of filepaths from selected entries
 */
export async function exportEntriesPdf(entriesFilepathsArr:string[]): Promise<string[]>
{
    //get entries
    var entries = await getEntriesByFilepaths(entriesFilepathsArr)

    //entries pdf
    var jsonArr:any[] = []
    entries.forEach( entry => 
        {
            jsonArr.push(entry.entryToJson())
        })
    //return txt files in array
    return jsonArr
}