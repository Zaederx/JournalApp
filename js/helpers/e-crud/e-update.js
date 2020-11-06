const fs = require('fs');
const directory = require('../directory');
exports.update = (event, entry, filename) => updateEntry(event, entry, filename);


function updateEntry(event, entry, filename) {
    filepath = directory.all + filename;
    fs.writeFile(filepath, entry, function(err) {
        if (err) {
            var message = 'updateEntry(): Error in updating entry file: '+err;
            console.log(message);
            event.reply('response-e-update', message);
        }
        else {
            var message = 'updateEntry(): File Updated Successfully';
            console.log(message);
            event.reply('response-e-update', message);
        }
    })
}