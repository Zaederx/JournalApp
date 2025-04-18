
import assert from 'assert'
import { TestDriver } from './test-driver.mjs'
import * as process from 'node:process'
import { ChildProcess } from 'child_process';
import { printFormatted } from 'printformatted-js'
import paths from 'path'
import { fileURLToPath } from 'url';
import type { RPCCommand } from './types/rpc-types';
import type { options } from './types/options'

//@ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = paths.dirname(__filename);
const binaryPath = paths.join(__dirname,'..','..','out','make','zip','darwin','x64','the-journal-app-darwin-x64-4.5.0.zip')
const args = []
const opts:options = {env:{NodeEnv:'test'},stdio:[]}
printFormatted('yellow', 'binaryPath:',binaryPath)
const driver = new TestDriver(binaryPath, args, opts)


describe('Navigation', () => {

    before(() => 
    {
        var rpcComm:RPCCommand = {command:'isReady'}
        driver.logErrors()
        driver.recieveRPC()//listen for RPC commands - app.on('message')
        driver.sendRPCCommand(rpcComm)
        
    })

    after(() => 
    {
        driver.stop()
    })

    it('should load create-entry.html view', async () => {
        //nav is always last to load
        //nav contents are injected into page via javascript
        //if the last nav button which is injected into page is then visible - then page should be visible
        const msgId = await driver.sendRPCCommand({command:'loadCreateEntryView'})

        var rpc = driver.rpcCommands[msgId]
        const { command, args, responseRecieved } = rpc as RPCCommand
        if(rpc) 
        {
            command
            
        }
        
        
        // while (app.rpcCommands[msgId].responseRecieved == null)
        // {

        // }
        // var navBtnSettings = document.querySelector('#nav') as HTMLElement
        // //@ts-ignore
        // var visible = navBtnSettings.checkVisibility({checkVisibilityCSS:true})//in the DOM
        // if (visible) 
        // {
        //     printFormatted('green', 'visible:', visible)
        // }
        // else 
        // {
        //     printFormatted('red', 'visible:', visible)
        // }
        
        // // await navBtnSettings.waitForDisplayed()//on the screen
        // assert.notDeepStrictEqual(visible,true)
    })
    it('should be visible on nav button click', async () => {
        //nav is always last to load
        //nav contents are injected into page via javascript
        //if the last nav button which is injected into page is then visible - then page should be visible
        const msgId = await driver.sendRPCCommand({command:'loadCreateEntryView'})

        var rpc = driver.rpcCommands[msgId]
        if(rpc) 
        {
            const { command, args, responseRecieved } = rpc as RPCCommand
            
        }
        
        
        // while (app.rpcCommands[msgId].responseRecieved == null)
        // {

        // }
        // var navBtnSettings = document.querySelector('#nav') as HTMLElement
        // //@ts-ignore
        // var visible = navBtnSettings.checkVisibility({checkVisibilityCSS:true})//in the DOM
        // if (visible) 
        // {
        //     printFormatted('green', 'visible:', visible)
        // }
        // else 
        // {
        //     printFormatted('red', 'visible:', visible)
        // }
        
        // // await navBtnSettings.waitForDisplayed()//on the screen
        // assert.notDeepStrictEqual(visible,true)
    })
    // it('should open tags-entries side panel', async () => {
        
    //     var entries = document.querySelector('#entries')
        
    //     // //view page
    //     // Page.viewTagsAndEntriesSidepanel()
    //     // //check if page is displayed
    //     // var success = SidePanelComponent.isDisplayed()
    //     assert.notDeepStrictEqual(entries.isExisting(),true)
    // })
    // it('should open edit tags page', () => {

    // })
    // it('should open add entry page', () => {

    // })
    // it('should open export entries page', () => {

    // })
    // it('should open settings page', () => {

    // })

    
})



