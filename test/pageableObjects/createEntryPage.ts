import Page from "./page";
import browser from '@wdio/globals'
export default class CreateEntryPage extends Page 
{
    constructor()
    {
        super('#create-entry');
    }
    public async clickEntryButton()
    {
        return await browser.$('#create-entry')
    }

    public async clickAddTagsButton()
    {
        return await browser.$('#btn-add-tags')
    }

    public async clickAddSelectedTagsButton()
    {
        return await browser.$('#add-selected-tags')
    }

    public async clickTagsPopupCloseButton()
    {
        return await browser.$('#close-btn')
    }

    public async clickTagTableRow(i:number)
    {
        var table = await browser.$('#tag-table-body')
        table.$('.tr')[i].click()
    }
}