//Read tag directories on page/document load
$(document).ready(function() { 
    getTopics();
    getFiles();
});

function getTopics() {
    window.CRUD.readDirectories();//reads tag directories
    //return topics to html side panel
    window.CRUD.readDResponse(function(dirHTML) {
        document.querySelector('#topics').innerHTML = dirHTML;
    });
}

function getFiles() {
    //fill side panel with file names
    window.CRUD.readDirectoryFiles('all');
    window.CRUD.readDFResponse(function(filesHTML) {
    document.querySelector('#files').innerHTML = filesHTML;

    //to display a selected file on click
    $('#files').find('div').each(function() {
        var filename = this.innerHTML;
       
        this.onclick = () => window.CRUD.readFile(filename);
        
    });
});

}

// note to self $('#id') =! documetn.querySelector('#id')
// the second returns the element, the first does not.
window.CRUD.readFileResponse(function (fileContent) {
    console.log(fileContent);
    var e = JSON.parse(fileContent);
    console.log(e.title);
    document.querySelector('#e-title').innerHTML = e.title;
    document.querySelector('#e-body').innerHTML = e.body;
    document.querySelector('#e-tags').innerHTML = e.tags;
});



// an object with an event/trigger for reading from a file to begin



//function to recieve response from main process - successful or unsuccessful