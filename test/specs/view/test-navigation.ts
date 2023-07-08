import { browser } from '@wdio/globals';
import Page from '../../pageableObjects/page';
import SidePanelComponent from '../../pageableObjects/side-panel';
import assert from 'assert'

describe('Testing Navigation', () => {

    it('should have page visible', async () => {
        //nav is always last to load
        //nav contents are injected into page via javascript
        //if the last nav button which is injected into page is then visible - then page should be visible
        browser.url('file:///Users/zacharyishmael/Documents/GitHub/Electron/CV/JournalApp/html/create-entry.html')
        var navBtnSettings = await browser.$('#nav')
        await navBtnSettings.waitForExist()//in the DOM
        await navBtnSettings.waitForDisplayed()//on the screen
        assert.notDeepStrictEqual(navBtnSettings.isDisplayed(),true)
    })
    it('should open tags-entries side panel', async () => {
        
        var entries = await browser.$('#entries')
        entries.waitForExist()
        // //view page
        // Page.viewTagsAndEntriesSidepanel()
        // //check if page is displayed
        // var success = SidePanelComponent.isDisplayed()
        assert.notDeepStrictEqual(entries.isExisting(),true)
    })
    // it('should open edit tags page', () => {

    // })
    // it('should open add entry page', () => {

    // })
    // it('should open export entries page', () => {

    // })
    // it('should open settings page', () => {

    // })

})