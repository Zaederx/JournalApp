/* Constants  */
const btn_submit_tag:HTMLButtonElement|null = document.querySelector('#btn-submit-tag');
const tag_input:HTMLInputElement|null = document.querySelector('#tag-input');
var newTaglist:string[] = [];
/* Null Checks */
if(btn_submit_tag == null) console.error('Problem with: Submit New Tag Button')
else {btn_submit_tag.onclick = () => submitTag();}

if(tag_input == null) console.error('Problem with: Submit New Tag Button');

/* Functions */
/**
 * Submit tag to be added.
 * Triggered by clicking tag submission button (#btn-submit-tag).
 */
function submitTag() {
    //get tag from form
    var tagname:string = tag_input ? tag_input.value : '';
    console.log('tagname:'+tagname);
    //add Tag
    addTag(tagname);
    newTaglist = [];//clear list after submitting

}

/**
 * Sends tag to be created/added to list of tags.
 * @param tagname tag to be added
 */
function addTag(tagname:string) {
    if (tagname != '') {
        //add tag folder to tagDirs
        newTaglist.push(tagname);

        window.tagCRUD.createPromise(newTaglist,(successful:boolean) => {
            
            if(successful) {displayTagView(); console.log('Tag created successfully.');}
            else console.error('Failed to create tag:'+tagname);
        });

    }
    else console.error('tagname cannot be empty');
    //TODO add user alert for this
}