 /**
  * Encloses tag names in html.
  * This is used in preparation for being added
  * to html table body.
  * 
  * i.e.:
  * ``` 
  * var html:string = '';
  * tags.forEach( tag => {
  *     html += '<tr><td>'+tag+'</td></tr>\n';
  * });
  * return html;
  * ```
  * @param tags array of tagnames
  * @return html
  */
 function tagsToHtml(tags:string[]):string {
    var html:string = '';
    tags.forEach( tag => {
        if (tag.charAt(0) == '.') {/* Do not add .DS_STORE / System files*/}
        else html += '<tr>\n'+
        '<td>'+tag+'</td>\n' + 
        '<td>'+'default'+'</td>\n' + 
        '<td>'+'default'+'</td>\n'
        +'</tr>\n';
    });
    return html;
}