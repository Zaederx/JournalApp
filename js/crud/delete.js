"use strict";
const btn_delete = document.querySelector('#e-delete');
if (btn_delete != null)
    btn_delete.onclick = function () {
        console.log('delete button clicked');
        var filename = getEntryFilename();
        window.CRUD.deleteEntry(filename);
        refresh(); //from read.ts
    };
window.CRUD.deleteEntryResponse((message) => {
    console.log(message);
});
