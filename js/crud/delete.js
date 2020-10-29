const btn_delete = document.querySelector('#e-delete');

btn_delete.onclick = function (btnEvent) {
    var filename = '';
    window.CRUD.deleteEntry(filename);

    btnEvent.preventDefault();
}