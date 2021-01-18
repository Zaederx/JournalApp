
var bisort = require('./bisort');
export function sort(arr:[string&number[]], reversed) {
    arr = bisort.sort(arr, 0, arr.length);
    var a = [];
    if (reversed == true) {
        for (var i = arr.length -1; i > 0; i--) {
            a.push(arr[0][i]);
        }
    }
    else {
        for (var i = 0; i < arr.length; i++) {
            a.push(arr[0][i]);
        }
    }
    return a;
}