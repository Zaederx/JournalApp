import * as fs from 'fs'

export async function updateTag(dirName:string,newDirName:string) {
    //note the '.' at the start of the path is essential for this one to work
    var path = './tagDirs/'+dirName+'/'
    var newPath = './tagDirs/'+newDirName+'/'

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