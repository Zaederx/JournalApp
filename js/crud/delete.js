const btn_delete = document.querySelector('#e-delete');

btn_delete.onclick = function () {
    console.log('delete button clicked');
    var filename = getECurrent();
    window.CRUD.deleteEntry(filename);
    refresh();//from read.js
}

window.CRUD.deleteEntryResponse((message) => {
    console.log(message);
});