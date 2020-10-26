//Read tag directories on page/document load
$(document).ready(function() {
    window.CRUD.readDirectories('all');//reads tag directories

    window.CRUD.readDResponse(function(dirHTML) {
        document.querySelector('#topics').innerHTML = dirHTML;
    });
});

// an object with an event/trigger for reading from a file to begin
window.CRUD.readDirectories('all');
//function to request main process to read data

//function to recieve response from main process - successful or unsuccessful