const fs = require('fs');
const directory = require('../directory');

exports.delete = (event, filename) => deleteEntry(event, filename);


function deleteEntry(event, filename) {
    
    path = directory.all + filename;
    console.log('e-delete.js:file path:'+path);
    callback = function (error) {
        if (error) {
            console.log('Error deleting file:'+error);
            channel = 'response-e-delete';
            message = 'Error deleting file:'+filename;
            event.reply(channel, message);
            // throw error;
        }
    };
    fs.unlink(path, callback);
}