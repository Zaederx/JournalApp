/** 
 * File for export html page functionality 
 * */
import { ipcRenderer } from "electron";
// import { shell } from 'electron'
// import * as dir from '../directory'
import { dialog } from 'electron';
import { OpenDialogReturnValue } from "electron/main";

//variables
var btn_export_txt = document.querySelector('#btn-export-txt') as HTMLButtonElement;
var btn_export_json = document.querySelector('#btn-export-json') as HTMLButtonElement;
var btn_export_pdf = document.querySelector('#btn-export-pdf') as HTMLButtonElement;

btn_export_txt ? btn_export_txt.onclick = () => export_txt() : console.warn('btn_export_txt is null')
btn_export_json ? btn_export_json.onclick = () => export_json() : console.warn('btn_export_json is null')
btn_export_pdf ? btn_export_pdf.onclick = () => export_pdf() : console.warn('btn_export_pdf is null')

async function export_txt()
{
    console.log("function export_txt called")
    //send message to ipcMain to export entries txt
    ipcRenderer.invoke('export-entries-txt')
}


async function export_json()
{
    console.log("function export_json called")
    //send message to ipcMain to export entries json
    ipcRenderer.invoke('export-entries-json')
}

async function export_pdf()
{
    console.log("function export_pdf called")
    //send message to ipcMain to export entries pdf
    ipcRenderer.invoke('export-entries-pdf')
}