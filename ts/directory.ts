import paths from 'path'
import { app } from 'electron'
/**
 * The 'all' tag directory which contains all entries
 * 'tagDirs/all'
 */
const allEntries = paths.join(app.getPath('userData'),'tagDirs','all')

/**
 * Directory containing all tag folders - 
 * this directory is called 'tagDirs'
 */
const tagDirectory = paths.join(app.getPath('userData'),'tagDirs')


/**
 * Downloads directory
 */
const downloads = paths.join(app.getPath('downloads'))


/**
 * A folder called 'secure' where security data is sotred for the app
 */
const secureFolder = paths.join(app.getPath('userData'),'secure')

/**
 * Path to password hash
 */
const passwordHash = paths.join(app.getPath('userData'),'secure', 'password.txt')
//Note relative to tsconfig
/**
 * relative path a txt file which contains a
 * path relative to the html files to css themes.
 * Please see css folder.
 */
const themeFilepath = paths.join('css', 'theme.txt')

export { allEntries, tagDirectory, downloads, secureFolder, passwordHash, themeFilepath }