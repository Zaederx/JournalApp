import * as process from 'process'
import paths from 'path'
import { appendEntries } from './entry/crud/e-read'
import { printFormatted } from './other/stringFormatting'

printFormatted('blue', 'send-entries process started')

const allEntries = process.argv[2]
const tagDirectory = process.argv[3]
const tagName = process.argv[4]

printFormatted('green',"Node version: " + process.versions.node);
printFormatted('green','allEntries:', allEntries)
printFormatted('green','tagDirectory:', tagDirectory)

const path = paths.join(tagDirectory,tagName)

appendEntries(path)