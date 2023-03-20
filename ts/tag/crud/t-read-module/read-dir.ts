import * as fs from 'fs'
/**
 * 
 * @param dir main directory path i.e. './hello'
 * @param and optional addition to the path
 * 
 */
export async function readDir(dir:string):Promise<string[]> {
    var directoryContents:string[] = [];
    try {
        //using readdirSync - blocks IO until the read is done
        var directoryContents = await fs.promises.readdir(dir, {
            encoding: 'utf-8',/* Note: note the default. setting encoding to 'utf8' explicitly informs typescript -> only string[] not string[]|Buffer[] to be returned*/
            withFileTypes: false
        });
    }
    catch (err){
        console.error('Entry folder',dir,' could not be read');
    }
    return directoryContents;
}