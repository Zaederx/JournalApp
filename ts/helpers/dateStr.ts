export function dateStr() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var mins = date.getMinutes();
    var secs = date.getSeconds();

    var str = day + '-' + month + '-' + year + '-' + hour + '-' + mins + '-' + secs;

    return str;
}