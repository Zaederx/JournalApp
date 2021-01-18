"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateStr = void 0;
function dateStr() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var mins = date.getMinutes();
    var secs = date.getSeconds();
    var str = day + '-' + (month + 1) + '-' + year + '-' + hour + '-' + mins + '-' + secs;
    return str;
}
exports.dateStr = dateStr;
