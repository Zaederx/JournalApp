import * as c_process from 'child_process';
import EntryDate from "../../../classes/entry-date";
import paths from 'path'
/**
 * Finds birthtime of an entry (as a number).
 * Once the birthtime is known, it creates an {@link EntryDate}
 * and adds it to the given array.
 * @param directory - file directory
 * @param filename name of the subdirectory - i.e. tagDirectory 
 * @param arr an array of EntryDate
 * @see EntryDate
 */
export default function fetchBtime(directory:string,filename:string, arr:EntryDate[]) {
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
      var path = paths.join(directory,filename);
      var stat_birth = c_process.spawnSync('stat',['-f','%B', '-L', path]);
      //\x1b[32m - change output colour to green, %s string = string, %s again means then another string, then \x1b[0m changes the color back to default
      var green = '\x1b[32m'
      var default_colour = '\x1b[0m'
      var stringFormatting = green + '%s%s' + default_colour
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

      return arr
  }