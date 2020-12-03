"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = void 0;
const fs = require("fs");
const eDate = require("../dateStr");
function createEvent(event, entryJson) {
    console.log('ipcmain: Creating new Entry -' + entryJson);
    var directory = "tagDirs/all/";
    var fileName = eDate.dateStr() + ".json";
    fs.writeFile(directory + fileName, entryJson, (err) => {
        var message = '';
        if (err) {
            message = 'An error occured in saving the new entry.';
        }
        else {
            message = 'Entry saved succesfully';
        }
        console.log(message);
        event.reply('response-e-create', message);
    });
}
exports.createEvent = createEvent;
