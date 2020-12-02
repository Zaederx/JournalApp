const fs = require('fs');
const eDate = require('../dateStr');
exports.create =  (event,entry) => createEvent(event, entry);

function createEvent(event,entry) {
    console.log('ipcmain: Creating new Entry -' + entry);
    directory = "tagDirs/all/";
    
  
    fileName = eDate.dateStr() + ".json";
  
    fs.writeFile(directory+fileName, entry, (err) => {
      message = '';
      if (err) {
        message = 'An error occured in saving the new entry.';
        console.log(message);
        event.reply('response-e-create', message);
      }
      else {
        message = 'Entry saved succesfully';
        console.log(message);
        event.reply('response-e-create', message);
      }
    }); 
    
  }

