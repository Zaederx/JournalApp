export function dateStr() {
    var date = new Date();
    day = date.getDate();
    month = date.getMonth();
    year = date.getFullYear();


    str = day + '-' + month + '-' + year;

    return str;
}