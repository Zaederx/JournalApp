//variables

import paths from 'path';
import * as fs from 'fs';
import * as dir from '../../directory';
import path from 'path';
import PDF from 'pdfkit';
//@ts-ignore
import Entry  from '../../classes/entry';
import dateStr from '../crud/dateStr';

/*
 * NOTE: For each loops do not support async await.
 * Results in undefined behaviour.
 */


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
    //for each filepath
    for (var i = 0; i < entriesFilepathsArr.length; i++) 
    {
        //get filepath
        var filepath = entriesFilepathsArr[i]
        //get entry by filepath
        var entry = await getEntryByFilepath(filepath);
        //add entry to list of entries
        entry ? entries.push(entry) : console.log('entry is undefined') 
    } 
    console.log('entries',entries)
    return entries
}

export async function txtExportFunc(entry:Entry, filepath:string) {
    //get entry as txt output
    var e = new Entry(entry)//entry object to full entry with functions
    var txt = e.entryToTxt()
    console.log('entry txt output'+ txt)
    //write file to directory
    await fs.promises.writeFile(filepath, txt, 'utf-8')
}
/**
 * Note: by some weird quirk, I realised that
 * entry object created by parsing json lose their functions
 * and don't work as intended.
 * You have to create a whole new object that has the same 
 * properties copied over. 
 * @param entry 
 * @param filepath 
 */
export async function jsonExportFunc(entry:Entry, filepath:string) {
    //convert functionless entry to full entry
    var e = new Entry(entry)//entry object to full entry with functions
    var json = e.entryToJsonStr()
    console.log('entry json output'+ json)
    //write file to directory
    await fs.promises.writeFile(filepath, json, 'utf-8')
}
export async function pdfExportFunc(entry:Entry, filepath:string) {
    console.log('entry output'+ entry)
    var e = new Entry(entry)//entry object to full entry with functions
    createPDF(e, filepath)
}

/**
 * Export an entry as a json file
 * using the entry's name
 * @param entry_name name of entry 
 */
export async function exportEntries(entriesFilepathsArr:string[], fileExtension:string, func:Function)
{
    console.log('\nfunction exportEntriesTxt called\n')
    //get entries
    var entries = await getEntriesByFilepaths(entriesFilepathsArr)
    console.log('getEntriesByFilename():'+entries.toString())
    
    //get file directory path
    var exportDir = path.join(dir.downloads, 'journal-app-export-'+dateStr())
    console.log('exportDir:'+exportDir)

    //create directory
    try {
        console.log('making export directory:'+exportDir)
        fs.promises.mkdir(exportDir)
    } catch (error) {
        console.log('export-entry.ts - function exportEntries:'+error)
    }
    try 
    {
        //entries to filesystem
        entries.forEach( async (entry) => {
            console.log('entry.date:'+entry.cdate)
            //set filepath
            var filepath = path.join(exportDir, entry.cdate + fileExtension)
            console.log('export filepath:', filepath)
            try {
                //unique function for each file type
                func(entry,filepath)  
            } catch (error) {
                console.warn(error)
            }
        })
    }
    catch (err) 
    {
        console.warn('export-entry.ts - function exportEntriesTxt:'+err)
    }
}

function createPDF(entry:Entry, filepath:string)
{
    //create a new virtual document
    const doc = new PDF()

    //create an output file
    doc.pipe(fs.createWriteStream(filepath))

    //add entry text
    doc
    .fontSize(20)
    .text(entry.entryToTxt())

    //save
    doc.save()

    //finalise PDF file
    doc.end()
}


/*************** Exporting - final functions ************** */

export function exportToTxt(filepaths:string[])
{
    const extension = '.txt'
    exportEntries(filepaths, extension, txtExportFunc)
}
export function exportToJson(filepaths:string[])
{
    const extension = '.json'
    exportEntries(filepaths, extension, jsonExportFunc)
}
export function exportToPdf(filepaths:string[])
{
    const extension = '.pdf'
    exportEntries(filepaths, extension, pdfExportFunc)
}



