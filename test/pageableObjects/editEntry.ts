import Page from "./page"
import browser from '@wdio/globals'
export default class EditEntry  extends Page
{
    constructor()
    {
        super('#edit-entry')
    }
    public async clickUpdateEntry()
    {
        return await browser.$('#update-entry').click()
    }

    public async saveNewEntry()
    {
        return await browser.$('#save-new-entry').click()
    }

    public async editEntryTags()
    {
        return await browser.$('#edit-entry-tags').click()
    }
}