import { app } from 'electron'
import fs from 'fs'
/**
 * Originally made to produce electron binary file path
 *  for the wdio.config.ts. Now kept just in case this is
 * useful later.
 */
export default function pathsForAppBinaries()
{
  const appBinaryPath = app.getPath('exe')
  const appPath = app.getAppPath()
  const filename1 = 'electronBinaryPath.txt'
  const filename2 = 'electronAppPath.txt'

  try 
  {
    fs.promises.writeFile(filename1, appBinaryPath, 'utf-8')
    fs.promises.writeFile(filename2, appPath, 'utf-8')
  }
  catch (err) 
  {
    console.log(err)
  }
}