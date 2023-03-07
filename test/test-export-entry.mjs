import assert from "assert";
import export_entry from "../js/entry/export/export-entry.js";
import * as e_create from "../js/entry/crud/e-create.js";
describe('Test Export Entry',()=>{
    describe('create entry', () => {
        //create entry
        e_create.createEntry(e,'{"title":"Title-1", "body":"This is a test note.","tags":["all"]}')
    })
    describe('test getEntry()', () => {
        it('should return a non empty entry', () => {
            
            //get entry
            var entry = export_entry.getEntry("Title-1")
            

            if (entry.title) 
            {
                console.log(entry)
                return true
            }
            else 
            {
                throw new Error('test does not return an entry')
            }
        })
    })
})