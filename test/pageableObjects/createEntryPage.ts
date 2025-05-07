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
        return (await browser.$('#create-entry')).click()
    }

    public async clickAddTagsButton()
    {
        return (await browser.$('#btn-add-tags')).click()
    }

    public async clickAddSelectedTagsButton()
    {
        return (await browser.$('#add-selected-tags')).click()
    }

    public async clickTagsPopupCloseButton()
    {
        return (await browser.$('#close-btn')).click()
    }

    public async clickTagTableRow(i:number)
    {
        var table = await browser.$('#tag-table-body');
        table.$$('.tr')[0].click()
    }
}