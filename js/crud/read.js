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
    window.CRUD.readDirectoryFiles('all');
    window.CRUD.readDFResponse(function(filesHTML) {
    document.querySelector('#files').innerHTML = filesHTML;
    $('#files').find('div').each(function() {
        var filename = this.innerHTML;
       
        this.onclick = () => window.CRUD.readFile(filename);
        
    });
});

}



// an object with an event/trigger for reading from a file to begin



//function to recieve response from main process - successful or unsuccessful