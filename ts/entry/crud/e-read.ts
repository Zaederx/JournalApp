import * as fs from 'fs';
import * as entryMergeSort from '../../algorithms/entryMergeSort'
import * as process from 'child_process';
import paths from 'path'
import * as dirs from '../../directory';
import { EntryDate } from '../../classes/EntryDate';






/**
 * Read names of all the files in a directory.
 * Used to read all entry json files in a directory.
 * @param dir (path of) directory to be read
 * @param event Electron Event
 * @param address where to send the event reply i.e.
 * ``` event.reply(address, message);```
 * @return html `div` list of entry names
 * 
 */
export async function readDirFiles(dir:string) {
  console.log('ipcMain: Reading new Entry - ' + dir);
  var filenames:string[] = [];
  //get all files in the directory
  var dirFilenames:string[] = await fs.promises.readdir(dir,'utf-8')

  /** remove .DS_Store and other '.' files */
  dirFilenames.forEach((filename)=> {
    if (filename.charAt(0) != '.') {
      filenames.push(filename)
    }
  })

  return filenames
}

/**
 * Returns a sorted EntryDate array.
 * EntryDates contain entry's matched to their creation date
 * Creation date (btime) is used to sort them into order of last
 * created to first created entry
 * @param dir directory
 * @returns EntryDate[]
 */
export async function readDirFilesEntryDate(dir:string) {
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
  var newArr:EntryDate[] = entryMergeSort.mergeSort(arr)

  return newArr
}

/**
 * Takes sorted array of EntryDates and ouputs entry html divs
 * for the navigation panel
 * @param arr 
 * @returns 
 */
export function entryDateToHtml(arr:EntryDate[]) {
  var filesHTML = ''
  var i:number = 0;
  arr.forEach(entryDate => {
    if (i == 0) {
      filesHTML += '<div class="active entry">'+entryDate.name+'</div>\n';//class must be active entry!
      i++;
    } 
    else {
      filesHTML += '<div>'+entryDate.name+'</div>\n';
    }
  });
  return filesHTML
}


/**
 * Reads a single file from a directory.
 * @param event 
 * @param filename 
 */
export async function readSingleFile(filename:string) {
  console.log('ipcMain: Reading file - '+filename);

  var entry
  var entry_filepath = paths.join(dirs.allEntries,filename);
  var message
  try {
    entry = await fs.promises.readFile(entry_filepath,'utf-8')
    message = 'File read successfully'
    return entry
  }
  catch (error) {
    message = 'Error reading file'+error
    return message
  }
}


/**
 * Finds birthtime of an entry (as a number).
 * Once the birthtime is known, it creates an {@link EntryDate}
 * and adds it to the given array.
 * @param directory - file directory
 * @param filename name of the subdirectory - i.e. tagDirectory 
 * @param arr an array of EntryDate
 * @see EntryDate
 */
function fetchBtime(directory:string,filename:string, arr:EntryDate[]) {
  /*
   * From ZSH manual under 'stat' - see zsh terminal command 'man stat':
   * 
   *  -f format
               Display information using the specified format.  See the FORMATS
               section for a description of valid formats.
  
   * -L      Use stat(2) instead of lstat(2).  The information reported by
               stat will refer to the target of file, if file is a symbolic
               link, and not to file itself.
   */
  //Addtionally - %B inserts File BirthTime (Creation Date)
    var stat_birth = process.spawnSync('stat',['-f','%B', '-L', directory+'/'+filename]);
    //\x1b[32m - change output colour to green, %s string = string, %s again means then another string, then \x1b[0m changes the color back to white
    var stringFormatting = '\x1b[32m%s%s\x1b[0m'
    console.log(stringFormatting,'stat_birth.output:',stat_birth.output);

    //get file birthtime as str -> number
    var bString:string = stat_birth.stdout;
    console.log(stringFormatting,'stat_birth.stdout:',stat_birth.stdout)
    var btime:number = Number(bString);
    //create EntryDate - name and btime
    var eDate:EntryDate = new EntryDate(filename, btime);
    //add to list of EntryDates
    arr.push(eDate);

    //console logging errors
    var err:string = stat_birth.stderr;
    err != '' ? console.error('File Birthtime error:',err) : null;

    //console logging status
    var code:number|null = stat_birth.status;
    console.log('child process: "stat_birth" exited with code',code);
}