import paths from 'path'
import {app} from 'electron'
/**
 * The 'all' tag directory which contains all entries
 * 'tagDirs/all'
 */
export const allEntries = paths.join(app.getPath('userData'),'tagDirs','all')

/**
 * Directory containing all tag folders - 
 * this directory is called 'tagDirs'
 */
export const tagDirectory = paths.join(app.getPath('userData'),'tagDirs')


/**
 * Downloads directory
 */
export const downloads = paths.join(app.getPath('downloads'))


//Note relative to tsconfig
/**
 * relative path a txt file which contains a
 * path relative to the html files to css themes.
 * Please see css folder.
 */
export const themeFilepath = paths.join('css', 'theme.txt')