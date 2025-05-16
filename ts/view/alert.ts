/**
 * A way of recieving alerts from the backend of the app
 * and diaplying it on the frontend.
 */

import { ipcRenderer } from "electron";
import { printFormattedv2 } from "printformatted-js";

ipcRenderer.on('alert', (event, alertMessage:string) => {
    //print to console without stack trace
    var node = false
    var trace = false
    printFormattedv2(node, trace, 'yellow', alertMessage)
    //system alert pop up
    alert(alertMessage)
})