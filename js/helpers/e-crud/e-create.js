const fs = require('fs');
const eDate = require('../dateStr');
exports.create =  function createEvent(event,content) {
    console.log('ipcmain: Creating new Entry -' + content);
    directory = "tagDirs/all/";
    //assuming only one entry per day
    fileName = eDate.dateStr() + ".json";
  
    fs.writeFile(directory+fileName, content, (err) => {
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

