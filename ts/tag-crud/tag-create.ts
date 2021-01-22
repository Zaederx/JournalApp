/* Constants  */
const btn_submit_tag:HTMLButtonElement|null = document.querySelector('#btn-submit-tag');
const tag_input:HTMLInputElement|null = document.querySelector('#tag-input');

/* Null Checks */
if(btn_submit_tag == null) console.error('Problem with: Submit New Tag Button')
else btn_submit_tag.onclick = submitTag;

if(tag_input == null) console.error('Problem with: Submit New Tag Button');

/* Functions */
/**
 * Submit tag to be added.
 * Triggered by clicking tag submission button (#btn-submit-tag).
 */
function submitTag() {
    //get tag from form
    var tagname:string = tag_input? tag_input.value: '';
    //add Tag
    addTag(tagname);
}

/**
 * Sends tag to be created/added to list of tags.
 * @param tagname tag to be added
 */
function addTag(tagname:string) {
    if (tagname != '') {
        //add tag folder to tagDirs
        window.tagCRUD.create(tagname);
        window.tagCRUD.createR((response:string) => {
            //IMPORTANT improve this 
            console.log(response);
        });
    }
}