import { appendEntries } from "./entry/crud/e-read"
import { appendTags } from "./tag/crud/t-read"
import * as process from "process"

const allEntries = process.argv[2]
const tagDirectory = process.argv[3]

console.log("Node version: " + process.versions.node);
console.log('allEntries:', allEntries)
console.log('tagDirectory:', tagDirectory)

appendEntries(allEntries)
appendTags(tagDirectory)