import * as fs from 'fs';
import paths from 'path'
import * as dir from '../../directory'
import { printFormatted } from '../../other/printFormatted';

/**
 * Deletes a tag matching the speficied name
 * @param tagname name of tag to be deleted
 */
export function deleteTag(tagname:string):string {
    var success:string = 'Tag '+ tagname+' deleted'; 
    var failure:string = 'Error: Tag '+ tagname +' not deleted';
    var path = paths.join(dir.tagDirectory,tagname)
    fs.rmdir(path,
        {
            recursive: true
        }, () => 
        {
            printFormatted('green',success);
            return success;
        });
    return failure;
}
/**
 * Deletes a list of tags
 * @param tags list of tags
 */
export async function deleteTags(tags: string[]): Promise<string> {
    var message
    try 
    {
        tags.forEach(tag => 
            {
                deleteTag(tag)
            })
        message = 'Successfully deleted tags'
    }
    catch (error:any) 
    {
        printFormatted('red',error.message)
        message = 'Problem deleting tags'
    }
    
    return message
}

export async function removeEntrySymlinks(tagnames: string[], entryName: string) {
    var message = ''
    tagnames.forEach ( tag => {
        try {
            var path =  paths.join(dir.tagDirectory,tag,entryName)
            fs.promises.unlink(path)
            message = 'Successfully removed tag from entry'
        }
        catch (error) {
            console.log(error)
            message = 'Error removing tags from entry'
        }
    })
    
    return message
}

