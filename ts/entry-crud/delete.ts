const btn_delete:HTMLElement|null = document.querySelector(deleteEntry);

if(btn_delete != null)
btn_delete.onclick = function () {
    console.log('delete button clicked');
    confirmDelete()
}

window.CRUD.deleteEntryResponse((message:string) => {
    console.log(message);
});

function confirmDelete() {
    var confirmed = confirm('Are you sure you want to delete this entry?')
    if (confirmed) {
        deleteE()
    }
}

//delete Entry
function deleteE() {
    console.log('deleting entry')
    var filename = getEntryFilename();
    window.CRUD.deleteEntry(filename);
    refresh();//from read.ts
}