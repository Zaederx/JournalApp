import * as fs from 'fs';
import EntryDate from '../../../classes/entry-date'
import fetchBtime from './fetch-btime'
import entryMergeSort from '../../../algorithms/entryMergeSort'
/**
 * Returns a sorted EntryDate array.
 * EntryDates contain entry's matched to their creation date
 * Creation date (btime) is used to sort them into order of last
 * created to first created entry
 * @param dir directory
 * @returns EntryDate[]
 */
export default async function readDirFilesEntryDate(dir:string) {
  console.log('ipcMain: Reading new Entry - ' + dir);
  
  var dirFilenames:string[] = await fs.promises.readdir(dir,'utf-8')
  var filenames:string[] = [];//files without .DS_Store 
  //remove .DS_Store and other '.' files
  dirFilenames.forEach((filename)=> {
    if (filename.charAt(0) != '.') {
      filenames.push(filename)
    }
  })

  var arr:EntryDate[] = [];
  //for each filename fecth the birthtime and add to the entryDate array -> arr
  filenames.forEach( file => fetchBtime(dir,file,arr));
  //use mergesort to sort the entries and produce new sorted array
  var newArr:EntryDate[] = entryMergeSort(arr)

  return newArr
}
