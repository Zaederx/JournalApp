import * as fs from 'fs';
import * as entrySort from '../../algorithms/entrysort';
import * as process from 'child_process';
import paths from 'path'
import * as dirs from '../../directory';





/**
 * Read names of all the files in a directory.
 * Used to read all entry json files in a directory.
 * @param dir (path of) directory to be read
 * @param event Electron Event
 * @param address where to send the event reply i.e.
 * ``` event.reply(address, message);```
 * @return html `div` list of entry names
 * 
 * .
 * 
 * .
 * 
 * .
 */
export async function readDirFiles(dir:string) {
  console.log('ipcMain: Reading new Entry - ' + dir);
  
  var files:string[] = await fs.promises.readdir(dir,'utf-8')

  return files
}

/**
 * Takes files arr and returns them as HTML
 * @param files - filenames
 * @param directory - diretory of the files - the tag 'all' directory in our case
 * @returns 
 */
export function filesToHtml(files:string[],directory:string) {
  var filesHTML = '';
  var arr:EntryDate[] = [];
  files.forEach( file => fetchBtime(directory,file,arr));
  var start:number = 0;
  var end:number = arr.length-1;
  var newArr:EntryDate[] = entrySort.sort(arr,start,end);

  var i:number = 0;
  newArr.forEach(entryDate => {
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
    var stat_birth = process.spawnSync('stat',['-f','%B', '-L', directory+filename]);
    console.log('output',stat_birth.output);
    var bString:string = stat_birth.stdout;
    var btime:number = Number(stat_birth.stdout);
    var eDate:EntryDate = new EntryDate(filename, btime);
    arr.push(eDate);
    console.log('bString',bString);
    console.log('btime',btime);
    var err:string = stat_birth.stderr;
    err != '' ? console.error('File Birthtime error:',err) : null;

    var code:number|null = stat_birth.status;
    console.log('child process: "stat_birth" exited with code',code);
}