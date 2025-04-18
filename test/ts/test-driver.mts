import c_process, { ChildProcess }  from "child_process";
import { StdioOptions } from "child_process";
import { printFormatted } from 'printformatted-js'
import type { RPCCommand, RPCResponse } from "./types/rpc-types";
import type { options } from "./types/options"

/**
 * 
 * Calls that connects to and runs the electron binary for test.
 * Also can be used to send rpc (Remote Procedure Calls) messages to the running application.
 * See [link](https://www.electronjs.org/docs/latest/tutorial/automated-testing#using-a-custom-test-driver) for tutorial example of making Custom Tests & Test Driver from Electron website.
 */
export class TestDriver
{
    //for recieving messages
    rpcCommands:(RPCCommand|null)[]
    binaryPath:string
    args:string[]
    opts:options
    app:ChildProcess
    

    constructor(binaryPath:string, args:string[]=[],opts:options={env:{NODE_ENV:'test'},stdio:['inherit', 'inherit', 'inherit', 'ipc']})
    {
        this.rpcCommands = []
        this.binaryPath = binaryPath
        this.args = args
        this.opts = opts;
        const { env, stdio } = this.opts
        //if c_process.spawn doesn't work, try c_process.fork
        this.app = c_process.spawn(this.binaryPath, this.args, {stdio:stdio,env:env}).on('exit', (code, signal) => {
            printFormatted('yellow', 'exit code: ', code, '\nsignal:',signal)
        });
    }

    //REMOTE PROCEDURE CALL MESSAGE
    /**
     * A method for sending rpc commands to the app test methods.
     * See example:https://www.geeksforgeeks.org/node-js-process-send-method/
     * @param rpcComm
     */
    async sendRPCCommand(rpcComm:RPCCommand)
    {
        //set command msg id
        rpcComm!.msgId = this.rpcCommands.length
        //@ts-ignore
        const { command, args, msgId } = rpcComm
        printFormatted('yellow', 'RPCCommand:', rpcComm)
        var promise = new Promise<number>((resolve,reject) =>  
        {
            if(command)//args is optional so don't check for it
            {
                //send command and it's arguments
                //@ts-ignore
                var  successful = this.app.send(rpcComm)
                printFormatted('yellow', 'this.childProcess.send is successful:',successful)
                if(successful)
                {
                    //add command to list
                    this.rpcCommands.push(rpcComm)
                    resolve(msgId)
                }
                else
                {
                    //add null as there's no command//TODO check if there is a need to push null
                    this.rpcCommands.push(null)
                    reject(msgId)
                }
            }
            
        })
        return promise
    }
    
    /**
     * A method for recieving rpc command responses from the app. see example:https://www.geeksforgeeks.org/node-js-process-send-method/
     * Basically just to check that commands sent out to subscribers(handlers) are getting there.
     * 
     */
    recieveRPC()
    {
        this.app.on('message', (m:RPCCommand) => {
            printFormatted('green', 'Message send and recieved by test driver handler')
        })
    }

    stop()
    {
        this.app.kill()
    }


    logErrors()
    {
        this.app.stderr?.on('data', (data) => {
            printFormatted('red','data:',data)
        })
        this.app.on('error', (error) => {
            printFormatted('red', error)
            throw error
        })
        this.app.on('exit', (code,signal) => {
            printFormatted('yellow', 'exit code: ', code, '\nsignal:',signal)
        })
    }

    checkUnsentCommands()
    {
        printFormatted('yellow', 'Remote Procedure Call commands unsent:')
        this.rpcCommands.forEach((rpc) => 
        {
            //@ts-ignore
            const { responseRecieved } = rpc
            !(responseRecieved)
            ? printFormatted('red',rpc)
            : null
        })
    }
}
