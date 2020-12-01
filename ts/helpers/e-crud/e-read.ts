const fs = require('fs');
const dateSort = require('../algorithms/datesort');
const {spawn} = require('child_process');
const stat_birth = spawn('stat',['-f','%B']); //File Birthtime milliseconds
// exports.readAllDirectories = (event) => readAllDirectories(event);
// exports.readDirFiles =  (event, dir) => readDirFiles(event, dir);
// exports.readSingleFile = (event, filename) => readSingleFile(event,filename);




export function readAllDirectories(event) {
  var directory;
  try {
      //using readdirSync - blocks IO until the read is done - will try sending event reply only once directories are loaded
      directory = fs.readdirSync('tagDirs/');

  } catch (err) {
      console.error('Entry folder could not be read');
  }

  var dirHTML = '';

  var counter = 0;
  var arr = [];
  try {
      directory.forEach( subdirectory => {
      if (counter == 0) {
          fetchBtime(subdirectory,arr);
          counter++;
      }
      else {
          fetchBtime(subdirectory, arr);
      }
      });
      // event.reply('response-d-read', dirHTML);
  } catch (err) {
      console.error('Problem reading directories.');
  }

  var newArr = dateSort.sort(arr);//returns string[]

  var i = 0;
  newArr.forEach(date => {
    if (i == 0) {
      dirHTML += '<div class="active">'+date+'</div>\n';
      i++;
    } 
    else {
      dirHTML += '<div>'+date+'</div>\n';
    }
  });
  event.reply('response-d-read', dirHTML);
}

export function fetchBtime(subdirectory, arr) {
  stat_birth.stdout.on('data', (btime) => {
    arr.push([subdirectory,btime]);
    console.log('stdout: ${btime}');
  });
  stat_birth.stderr.on('data', (err) => {
    console.error('File Birthtime error:',err);
  });
  stat_birth.on('close', (code) => {
    console.log('child process: "stat_birth" exited with code ${code}');
  });
}

export function readDirFiles(event,dir) {
    console.log('ipcMain: Reading new Entry - ' + dir);
    var directory;
    var filesHTML = '';
      fs.readdir('tagDirs/'+ dir+'/', (error, files)=> {
  
        if (error) {
          event.reply('Entry folder '+dir+' could not be read.');
          console.log('Entry folder could not be read.');
          return console.error(error);
        }
        else {
          var count = 0;
          files.forEach( file => {
            if (count == 0) {
              filesHTML += '<div class="active entry">'+file+'</div>\n';
              count++;
            } else {
              filesHTML += '<div>'+file+'</div>\n';
            }
          });
          event.reply('response-de-read', filesHTML);
          
        }
  
      });
}

export function readSingleFile(event,filename) {
console.log('ipcMain: Reading file - '+filename);
var dir = 'tagDirs/all/';
fs.readFile(dir+filename, 'utf-8',(error, file) => {
    if (error) {
    event.reply('Entry '+file+' could not be read.');
    console.error('Entry could not be read.');
    } else {
    event.reply('response-e-read', file);
    console.info('File read successfully.');
    }
})
}