"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSingleFile = exports.readDirFiles = exports.readAllDirectories = void 0;
const fs = require("fs");
const entrySort = require("../algorithms/entrysort");
const process = require("child_process");
const EntryDate_1 = require("../../classes/EntryDate");
/**
 * Read all tag Directories.
 * @param event - An Electron Event
 */
function readAllDirectories(event) {
    var directory;
    var dirHTML = '';
    try {
        //using readdirSync - blocks IO until the read is done - will try sending event reply only once directories are loaded
        directory = fs.readdirSync('tagDirs/');
        var counter = 0;
        directory.forEach(subdirectory => {
            if (counter == 0) {
                dirHTML += '<div class="active tag">' + subdirectory + '</div>\n';
                counter++;
            }
            else {
                dirHTML += '<div>' + subdirectory + '</div>\n';
            }
        });
        event.reply('response-d-read', dirHTML);
    }
    catch (err) {
        console.error('Entry folder could not be read');
    }
}
exports.readAllDirectories = readAllDirectories;
/**
 * Read names of all the files in a directory.
 * @param event Electron Event
 * @param dir (path of) directory to be read
 */
function readDirFiles(event, dir) {
    console.log('ipcMain: Reading new Entry - ' + dir);
    var directory;
    var filesHTML = '';
    var arr = [];
    var prefix = 'tagDirs/' + dir + '/';
    fs.readdir(prefix, (error, files) => {
        if (error) {
            event.reply('Entry folder ' + dir + ' could not be read.');
            console.log('Entry folder could not be read.');
            return console.error(error);
        }
        else {
            files.forEach(file => {
                fetchBtime(prefix, file, arr);
                // filesHTML += '<div class="active entry">'+file+'</div>\n';
            });
            var start = 0;
            var end = arr.length - 1;
            var newArr = entrySort.sort(arr, start, end);
            var i = 0;
            newArr.forEach(entryDate => {
                if (i == 0) {
                    filesHTML += '<div class="active entry">' + entryDate.name + '</div>\n';
                    i++;
                }
                else {
                    filesHTML += '<div>' + entryDate.name + '</div>\n';
                }
            });
            event.reply('response-de-read', filesHTML);
        }
    });
}
exports.readDirFiles = readDirFiles;
/**
 *
 * @param event
 * @param filename
 */
function readSingleFile(event, filename) {
    console.log('ipcMain: Reading file - ' + filename);
    var dir = 'tagDirs/all/';
    fs.readFile(dir + filename, 'utf-8', (error, file) => {
        if (error) {
            event.reply('Entry ' + file + ' could not be read.');
            console.error('Entry could not be read.');
        }
        else {
            event.reply('response-e-read', file);
            console.info('File read successfully.');
        }
    });
}
exports.readSingleFile = readSingleFile;
/**
 * Finds birthtime of a subdirectories.
 * Once the birthtime is known, it creates an EntryDate
 * and adds it to the given array.
 * @param file name of the subdirectory - i.e. tagDirectory
 * @param arr an array of EntryDate
 */
function fetchBtime(prefix, file, arr) {
    /**
     * From ZSH manual under stat:
     *
     *  -f format
                 Display information using the specified format.  See the FORMATS
                 section for a description of valid formats.
    
     * -L      Use stat(2) instead of lstat(2).  The information reported by
                 stat will refer to the target of file, if file is a symbolic
                 link, and not to file itself.
     */
    var stat_birth = process.spawnSync('stat', ['-f', '%B', '-L', prefix + file]);
    console.log('output', stat_birth.output);
    var bString = stat_birth.stdout;
    var btime = Number(stat_birth.stdout);
    var eDate = new EntryDate_1.EntryDate(file, btime);
    arr.push(eDate);
    console.log('bString', bString);
    console.log('btime', btime);
    var err = stat_birth.stderr;
    console.error('File Birthtime error:', err);
    var code = stat_birth.status;
    console.log('child process: "stat_birth" exited with code', code);
}
