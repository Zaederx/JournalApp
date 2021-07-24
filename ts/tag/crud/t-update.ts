import paths from 'path'
import * as fs from 'fs'
import * as dirs from '../../directory'

export async function updateTag(dirName:string,newDirName:string) {
    //note the '.' at the start of the path is essential for this one to work
    var path = paths.join(dirs.tagDirectory,dirName)
    var newPath = paths.join(dirs.tagDirectory,newDirName)

    try {
        fs.promises.rename(path,newPath)
    }
    catch (error) {
        console.log('Error message:',error)
        return error
    }
    var message = 'Tag renamed successfully'
    return message
}