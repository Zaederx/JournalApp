//variables

import paths from 'path';
import * as fs from 'fs';
import * as dir from '../../directory';
 

//functions
/**
 * Retrieve entry from filesystem by giving
 * the entry filename
 * @param entry_name entry filename
 */
async function getEntry(entry_name: string)
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
    var entryStr:string = await fs.promises.readFile(filepath,'utf-8')
    var entry:Entry = JSON.parse(entryStr)
    return entry
}

/**
 * Retrieve an array of Entries from file
 * system json entry files
 * @param entriesFilepathsArr array of filepaths for entries
 */
async function getEntries(entriesFilepathsArr:string[]):Promise<Entry[]>
{
    var entries:Entry[] = []
    entriesFilepathsArr.forEach(async (filepath) => 
    {
        var entry = await getEntryByFilepath(filepath);
        entries.push(entry)
    }) 
    
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
 */
export async function exportEntriesTxt(entriesFilepathsArr:string[]):Promise<string[]>
{
    //get entries
    var entries:Entry[] = await getEntries(entriesFilepathsArr)

    //entries to txt
    var txtArr:string[] = []
    entries.forEach( entry => 
        {
            txtArr.push(entry.entryToTxt())
        })
    //return txt files in array
    return txtArr
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
    var entries:Entry[] = await getEntries(entriesFilepathsArr)

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
    var entries = await getEntries(entriesFilepathsArr)

    //entries pdf
    var jsonArr:any[] = []
    entries.forEach( entry => 
        {
            jsonArr.push(entry.entryToJson())
        })
    //return txt files in array
    return jsonArr
}