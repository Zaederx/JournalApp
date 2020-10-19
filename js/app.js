const btn_submit = document.querySelector("#btn-submit");
btn_submit.onclick = function () {
    window.logAPI.message('console',"test");
 title = document.querySelector("#new-entry-title").value;
 body = document.querySelector("#new-entry-body").value;
 tags = document.querySelector("#new-entry-tags").value;
 message = "title:"+title+" body:"+ body+ " tags:"+ tags;
 window.logAPI.message('console',message);
 entry = new Entry(title,body,tags);
 json = JSON.stringify(entry);
 window.logAPI.message('console',json);
 window.logAPI.message('console',"test");
}

//idea for later: Also should have a method for asychronously checking for tags being added and edit the look of comma separated tags