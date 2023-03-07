/**
 * Returns the current date as a string.
 * @return date as a string
 */
export default function dateStr():string {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var mins = date.getMinutes();
    var secs = date.getSeconds();

    var str = day + '-' + (month+1) + '-' + year + '-' + hour + '-' + mins + '-' + secs;

    return str;
}