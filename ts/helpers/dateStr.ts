exports.dateStr = () => {
    var date = new Date();
    day = date.getDate();
    month = date.getMonth();
    year = date.getFullYear();
    hour = date.getHours();
    mins = date.getMinutes();
    secs = date.getSeconds();

    str = day + '-' + month + '-' + year + '-' + hour + '-' + mins + '-' + secs;

    return str;
}