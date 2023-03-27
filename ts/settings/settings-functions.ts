import fs from 'fs';
import * as dirs from '../directory'

export async function saveSettingsJson(settingsObject:object) 
{
  const json = JSON.stringify(settingsObject)
  fs.promises.writeFile(dirs.settingsFile, json)
}
export async function retrieveSettingsJson()
{
  var settingsJson = await fs.promises.readFile(dirs.settingsFile, 'utf-8')
  const settings = JSON.parse(settingsJson)
  return settings
}