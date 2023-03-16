// import { $, $$, click } from "webdriverio/build/commands/element";
import { browser } from "@wdio/globals";
import { ChainablePromiseElement, Selector } from "webdriverio"
export default class Page
{
    pageId:Selector
    constructor(pageId:Selector) {
        this.pageId = pageId;
    }

    public get getPageId():Selector 
    {
        return this.pageId;
    }

    public static async viewTagsAndEntriesSidepanel()
    {
        return await browser.$('#btn-tags').click();
    }

    public static async viewEditTagsPage()
    {
        return await browser.$('#btn-edit-tags').click();
    }

    public static async viewAddEntryPage()
    {
        return await browser.$('#btn-add-entry').click();
    }

    public static async viewExportPage()
    {
        return await browser.$('#btn-export').click();
    }

    public static async viewSettingsPage()
    {
        return await browser.$('#btn-settings').click();
    }
}