import paths from 'path'
import {app} from 'electron'
/**
 * The 'all' tag directory which contains all entries
 * 'tagDirs/all'
 */
export const allEntries = paths.join(app.getPath('userData'),'tagDirs','all')

/**
 * Directory containing all tag folders - 'tagDirs'
 */
export const tagDirectory = paths.join(app.getPath('userData'),'tagDirs')


/**
 * Downloads directory
 */
export const downloads = paths.join(app.getPath('downloads'))