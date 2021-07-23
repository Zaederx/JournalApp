import * as fs from 'fs';
import * as dir from '../../directory'

/**
 * Deletes a tag matching the speficied name
 * @param tagname name of tag to be deleted
 */
export function deleteTag(tagname:string):string {
    var success:string = 'Tag '+ tagname+' deleted'; 
    var failure:string = 'Error: Tag '+ tagname +' not deleted';
    fs.rmdir(dir.tagDirectory+tagname,{
        recursive: true
    }, () => {
        console.log(success);
        return success;
    });
    return failure;
}
export function deleteTags(tags: string[]): string | PromiseLike<string> {
    var message = ''
    try {
        tags.forEach(tag => {
            deleteTag(tag)
        })
        message = 'Successfully deleted tags'
    }
    catch (error) {
        console.log(error)
        message = 'Problem deleting tags'
    }
    
    return message
}

