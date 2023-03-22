import * as process from 'process'
import paths from 'path'
import { appendEntries } from './entry/crud/e-read'

const allEntries = process.argv[2]
const tagDirectory = process.argv[3]
const tagName = process.argv[4]

console.log("Node version: " + process.versions.node);
console.log('allEntries:', allEntries)
console.log('tagDirectory:', tagDirectory)

const path = paths.join(tagDirectory,tagName)
const clearEntries = true
appendEntries(path, clearEntries)