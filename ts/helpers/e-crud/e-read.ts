import * as fs from 'fs';
import * as entrySort from '../algorithms/entrysort';
import * as process from 'child_process';
import {EntryDate} from '../../classes/EntryDate';

/**
 * Read all tag Directories.
 * Used to fill tag directory side bar/panel
 * @param event - An Electron Event
 */
export function readAllDirectories(event) {
  var directory:string[];
  var dirHTML = '';
  try {
      //using readdirSync - blocks IO until the read is done - will try sending event reply only once directories are loaded
      directory = fs.readdirSync('tagDirs/');
      var counter:number = 0;
      directory.forEach( subdirectory => {
        if (counter == 0) {
            dirHTML += '<div class="active tag">'+subdirectory+'</div>\n';//must be active tag!
            counter++;
        }
        else {
            dirHTML += '<div>'+subdirectory+'</div>\n';
        }
        });
        event.reply('response-d-read', dirHTML);
  
  } catch (err) {
      console.error('Entry folder could not be read');
  }
  
}



/**
 * Read names of all the files in a directory.
 * Then returns these in a list of `<div>Entry Name</div>`
 * @param event Electron Event
 * @param dir (path of) directory to be read
 * @return html `div` list of entry names
 */
export function readDirFiles(event,dir) {
    console.log('ipcMain: Reading new Entry - ' + dir);
    var directory;
    var filesHTML = '';
    var arr:EntryDate[] = [];
    var prefix:string = 'tagDirs/'+ dir+'/';
      fs.readdir(prefix, (error, files)=> {
        if (error) {
          event.reply('Entry folder '+dir+' could not be read.');
          console.log('Entry folder could not be read.');
          return console.error(error);
        }
        else {
          
          files.forEach( file => fetchBtime(prefix,file,arr));
          var start:number = 0;
          var end:number = arr.length-1;
          var newArr = entrySort.sort(arr,start,end);

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
          event.reply('response-de-read', filesHTML);
         
        }
      });
  
}

/**
 * Reads a single file from a directory.
 * @param event 
 * @param filename 
 */
export function readSingleFile(event,filename) {

  console.log('ipcMain: Reading file - '+filename);

  var dir = 'tagDirs/all/';

  fs.readFile(dir+filename, 'utf-8',(error, file) => {

    if (error) {
      event.reply('Entry '+file+' could not be read.');
      console.error('Entry could not be read.');
    } 

    else {
      event.reply('response-e-read', file);
      console.info('File read successfully.');
    }

  })
}

/**
 * Finds birthtime of a subdirectories.
 * Once the birthtime is known, it creates an EntryDate
 * and adds it to the given array.
 * @param file name of the subdirectory - i.e. tagDirectory 
 * @param arr an array of EntryDate
 */
function fetchBtime(prefix:string,file:string, arr:EntryDate[]) {
  /**
   * From ZSH manual under 'stat' - see zsh terminal command 'man stat':
   * 
   *  -f format
               Display information using the specified format.  See the FORMATS
               section for a description of valid formats.
  
   * -L      Use stat(2) instead of lstat(2).  The information reported by
               stat will refer to the target of file, if file is a symbolic
               link, and not to file itself.
   */
  
    var stat_birth = process.spawnSync('stat',['-f','%B', '-L', prefix+file]);
    console.log('output',stat_birth.output);
    var bString:string = stat_birth.stdout;
    var btime:number = Number(stat_birth.stdout);
    var eDate:EntryDate = new EntryDate(file, btime);
    arr.push(eDate);
    console.log('bString',bString);
    console.log('btime',btime);
    var err:string = stat_birth.stderr;
    console.error('File Birthtime error:',err);

    var code:number|null = stat_birth.status;
    console.log('child process: "stat_birth" exited with code',code);
  }