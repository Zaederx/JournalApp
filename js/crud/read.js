//Read tag directories on page/document load
$(document).ready(function() {
    window.CRUD.readDirectories();//reads tag directories
    //return topics to html side panel
    window.CRUD.readDResponse(function(dirHTML) {
        document.querySelector('#topics').innerHTML = dirHTML;
    });


    //
    window.CRUD.readDirectoryFiles('all');
    window.CRUD.readDFResponse(function(filesHTML) {
        document.querySelector('#files').innerHTML = filesHTML;
    });
});

// an object with an event/trigger for reading from a file to begin

// window.CRUD.readDirectories();

// //function to request main process to read data
// window.CRUD.readDFResponse()

// window.CRUD.readDResponse()


//function to recieve response from main process - successful or unsuccessful