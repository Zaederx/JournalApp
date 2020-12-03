"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEntry = void 0;
const fs = require("fs");
const directory = require("../directory");
/**
 * Functions used by main to delete Entries.
 * @param event
 * @param filename
 */
function deleteEntry(event, filename) {
    var path = directory.all + filename;
    console.log('e-delete.js:file path:' + path);
    var callback = function (error) {
        if (error) {
            console.log('Error deleting file:' + error);
            var channel = 'response-e-delete';
            var message = 'Error deleting file:' + filename;
            event.reply(channel, message);
            // throw error;
        }
    };
    fs.unlink(path, callback);
}
exports.deleteEntry = deleteEntry;
