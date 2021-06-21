/** Button used to open the update entry view (by displaying the #new-entry-view div) */
const btn_update:HTMLElement|null = document.querySelector(updateOldEntryId);//btn to open update view
/** Button used to submit update changes. */
const btn_submit_update:HTMLElement|null = document.querySelector(submitUpDateId);
const etitle:HTMLDivElement|null = document.querySelector('#edit-e-title');
const ebody:HTMLDivElement|null = document.querySelector('#edit-e-body');
// const etags:HTMLElement|null = document.querySelector('#new-entry-tags');



btn_submit_update ?  btn_submit_update.onclick = (event) => {updateFile(event)} : console.error('update.ts: var btn_submit_update = null');

var e = new Entry()//FOR ACCESS TO CONVERSION METHODS/FUNCTIONS
function updateFile(event:Event) {
    window.logAPI.message('form submit button clicked\n');

    var etitle = (document.querySelector('#edit-e-title') as HTMLInputElement).innerText as string;
    var ebody = (document.querySelector('#edit-e-body') as HTMLDivElement).textContent as string;
    var e_tags = tags
    var message = 'title:' + etitle + ' body:' + ebody + ' tags:' + e_tags;
    console.log('message:',message);
    window.logAPI.message(message);


    var entry = new Entry(etitle, ebody, e.stringToArr(e_tags));
    var entryJSON = JSON.stringify(entry);
    window.logAPI.message(entryJSON);

    var filename = getEntryFilename();//from vars.js
    
    //need to call method that creates entry file in file system
    window.CRUD.updateEntry(entryJSON, filename);
    event.preventDefault();//to disable postback - otherwise causes problems with updating content

    //call a method that symlinks the file to all tags folders
    if (form != null)
    form.reset();//because default are disabled

    refresh();//from read.js
}

const etags = document.querySelector('#new-entry-right-nav')
btn_update ? btn_update.onclick = (event) => getUpdateForm(event) : console.log('btn_update is null');

/** Displays the update form.
 * Also fills that form with information of the 
 * currently selected Entry 
 * note event is user event - i.e. mouseEvent*/
function getUpdateForm(event:Event) {
    console.log('*** getUpdateForm called ***')
    //display 'new-entry-view'
    displayNEView();
    //read entry
    var entry:Entry = getECurrent();//from vars.js
    
    //insert into fields
    if(etitle != null) etitle.textContent =  entry.title;
    else console.error('update.ts: const etitle = null')

    if(ebody != null) ebody.textContent = entry.body;
    else console.error('update.ts: const ebody = null')

    var tags = csvToSpan(entry.tags)
    console.log('getUpdateForms: tags',tags)
    if(etags != null) etags.innerHTML = tags;
    else console.error('update.ts: const etags = null')
}

function csvToSpan(tags:string[]) {
    var html = ''
    tags.forEach((tag)=>{
        html += '<div>'+tag+'</div>\n'
    })
    return html
}