import Page from '../../pageableObjects/page';
import SidePanelComponent from '../../pageableObjects/side-panel';
import assert from 'assert'
describe('Testing Navigation', () => {
    it('should open tags-entries side panel', async () => {
        //view page
        Page.viewTagsAndEntriesSidepanel()
        //check if page is displayed
        var success = SidePanelComponent.isDisplayed()
        const expected = true
        assert.notStrictEqual(success,expected)
    })
    it('should open edit tags page', () => {

    })
    it('should open add entry page', () => {

    })
    it('should open export entries page', () => {

    })
    it('should open settings page', () => {

    })

})