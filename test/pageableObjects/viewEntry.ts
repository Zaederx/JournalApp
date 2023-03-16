import Page from "./page";
import browser from '@wdio/globals'

export default class ViewEntry extends Page
{
    /**
     * Click edit entry button and opens
     * edit entry view
     */
    public async clickEditEntryButton()
    {
        return await browser.$('#update-entry').click()
    }
    
    public async clickDeleteEntryButton()
    {
        return await browser.$('#delete-entry').click()
    }
}