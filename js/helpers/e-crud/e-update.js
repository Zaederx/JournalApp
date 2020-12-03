"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEntry = void 0;
const fs = require("fs");
const directory = require('../directory');
function updateEntry(event, entry, filename) {
    var filepath = directory.all + filename;
    fs.writeFile(filepath, entry, function (err) {
        if (err) {
            var message = 'updateEntry(): Error in updating entry file: ' + err;
            console.log(message);
            event.reply('response-e-update', message);
        }
        else {
            var message = 'updateEntry(): File Updated Successfully';
            console.log(message);
            event.reply('response-e-update', message);
        }
    });
}
exports.updateEntry = updateEntry;
