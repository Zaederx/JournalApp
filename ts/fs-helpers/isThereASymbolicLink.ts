import fs from 'fs';
export default async function isThereASymbolicLink(path:string)
{
    var isThere = false
  try 
  {
    var stat = await fs.promises.stat(path)
    return stat.isSymbolicLink()
  } catch (error) {
    console.log(error)
    return isThere//false
  }
}