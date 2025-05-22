import paths from 'path'
import { app } from 'electron'
/**
 * The 'all' tag directory which contains all entries
 * 'tagDirs/all'
 */
const allEntries = paths.join(app.getPath('userData'),'tagDirs','all')

/**
 * Directory containing all tag folders - 
 * this directory is called 'tagDirs' (i.e. tagDirectories)
 */
const tagDirectory = paths.join(app.getPath('userData'),'tagDirs')


const currentEntryDir = paths.join(app.getPath('userData'), 'tagDirs', 'current-entry' )
/**
 * Downloads directory
 */
const downloads = paths.join(app.getPath('downloads'))

/**
 * A folder called 'secure' where security data is sotred for the app
 */
const secureFolder = paths.join(app.getPath('userData'),'secure')


const verificationCodeHash = paths.join(app.getPath('userData'), 'secure', 'verification-code.txt')

const resetCodeHash = paths.join(app.getPath('userData'), 'secure', 'reset-code.txt')

/**
 * Path to password hash
 */
const passwordHash = paths.join(app.getPath('userData'), 'secure', 'password.txt')

/**
 * The hash of the user's email.
 * Stored in email.txt.
 */
const emailHash = paths.join(app.getPath('userData'), 'secure', 'email-hash.txt')

const verifiedFolder = paths.join(app.getPath('userData'), 'verified')

/**
 * A text file that states whether the email is verified or not.
 * Stored in email-verified.txts
 */
const emailVerified = paths.join(app.getPath('userData'), 'verified', 'email-verified.json')

/**
 * Folder that contains the settings json file
 */
const settingsFolder = paths.join(app.getPath('userData'), 'settings')

/**
 * Path directly to the settings.json file
 */
const settingsFile = paths.join(app.getPath('userData'), 'settings', 'settings.json')

//Note relative to tsconfig
/**
 * relative path a txt file which contains a
 * path relative to the html files to css themes.
 * Please see css folder.
 */
const themeFilepath = paths.join(app.getPath('userData'), 'settings', 'theme.txt')

//TODO - Do I need the scripts path or was it just an idea from another point
// think I needed it for making the code base into an executable (couldn't run code from within the app like append.ts in it's child process)
// Need to double check all this.
const scripts = paths.join(app.getPath('userData'), 'scripts')
export { allEntries, tagDirectory, currentEntryDir, downloads, secureFolder, verificationCodeHash, resetCodeHash, passwordHash, emailHash, verifiedFolder, emailVerified, settingsFolder, settingsFile, themeFilepath }

