import browser from '@wdio/globals'
export default class SidePanelComponent
{
    static compId = '#side-panel'
    public static isDisplayed()
    {
        return browser.$(this.compId).isDisplayed();
    }
}