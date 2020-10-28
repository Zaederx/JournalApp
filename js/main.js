const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs');
const path = require('path');
const helper = require('./helpers/dateStr');
function createWindow () {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        worldSafeExecuteJavaScript: true ,
        contextIsolation: true,//otherwise WorldSafe.. message still appears
        preload: path.join(__dirname, "preload.js")
    }
  })

  window.loadFile('html/main.html');
  window.webContents.openDevTools()
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/* IPC FUNCTIONS */
// TODO: set up ipcMain
ipcMain.on('new_content', function(e,content) {
    console.log('ipcmain: New Content -' + content);

    window.loadFile(content)
});

// TODO: set up ipcMain
ipcMain.on('create_Entry', function(event,content) {
  console.log('ipcmain: Creating new Entry -' + content);
  directory = "tagDirs/all/";
  //assuming only one entry per day
  fileName = 'E-'+ helper.dateStr() + ".json";

  fs.writeFile(directory+fileName, content, (err) => {
    message = '';
    if (err) {
      message = 'An error occured in saving the new entry.';
      console.log(message);
    }
    else {
      message = 'Entry saved succesfully';
      console.log(message);
      event.reply('response-c', message);
    }
  }); 
  
});

// READ DIRECTORIES - lists all tag directories
ipcMain.on('read_Directories', function(event) {
  var directory;
  try {
    //using readdirSync - blocks IO until the read is done - will try sending event reply only once directories are loaded
    directory = fs.readdirSync('tagDirs/');

  } catch (err) {
    console.log('Entry folder could not be read');
  }

  dirHTML = '';
  var counter = 0;
  try {
    directory.forEach( subdirectory => {
      if (counter == 0) {
        dirHTML += '<div class="active">'+subdirectory+'</div>\n';
      }
      else {
        dirHTML += '<div>'+subdirectory+'</div>\n';
      }
    });
    event.reply('response-rD', dirHTML);
  } catch (err) {
    console.log('Problem reading directories.');
  }
  
})

// READ DIRECTORY FILES - files inside a directory
ipcMain.on('readDirectoryFiles', function(event,dir) {
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
        event.reply('response-rDF', filesHTML);
        
      }

    });
});


// Read single file
ipcMain.on('readFile', (event,filename) => {
  console.log('ipcMain: Reading file - '+filename);
  var dir = 'tagDirs/all/';
  fs.readFile(dir+filename, 'utf-8',(error, file) => {
    if (error) {
      event.reply('Entry '+file+' could not be read.');
      console.log('Entry could not be read.');
    } else {
      event.reply('response-rF', file);
      console.log('File read successfully.');
    }
  })
})


// TODO: set up ipcMain
ipcMain.on('read_Entry', function(e,content) {
  console.log('ipcMain: Reading new Entry -' + content);

  console.log('ipcMain: Problem presenting entries.');
})
// TODO: set up ipcMain
ipcMain.on('update_Entry', function(e,content) {
  console.log('ipcMain: Updating Entry -' + content);

  
})
// TODO: set up ipcMain
ipcMain.on('delete_Entry', function(e,content) {
  console.log('ipcMain: Deleting Entry -' + content);

  
})

ipcMain.on('console', function (e,content) {
  console.log('ipcMain: loging message to console:'+ content);
})