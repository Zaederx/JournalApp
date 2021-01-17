const btn_addTag:HTMLElement|null = document.querySelector('#btn-submit');

//TODO Add a succesful message/alert box adding a new tag

if(btn_addTag != null)
btn_addTag.onclick = (event) => displayTagView();



function addTag(tagname:string) {
    //add tag folder to tagDirs
    window.tagCRUD.create(tagname);
}