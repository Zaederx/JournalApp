/** 
 * File for export html page functionality 
 * */
import { ipcRenderer } from "electron";

//variables
var btn_export_txt = document.querySelector('#btn-export-txt') as HTMLButtonElement;
var btn_export_json = document.querySelector('#btn-export-json') as HTMLButtonElement;
var btn_export_pdf = document.querySelector('#btn-export-pdf') as HTMLButtonElement;
var btn_export_td = document.querySelector('#btn-export-transfer-data') as HTMLButtonElement;
var btn_import_td = document.querySelector('#btn-import-transfer-data') as HTMLButtonElement

btn_export_txt ? btn_export_txt.onclick = () => export_txt() : console.warn('btn_export_txt is null')
btn_export_json ? btn_export_json.onclick = () => export_json() : console.warn('btn_export_json is null')
btn_export_pdf ? btn_export_pdf.onclick = () => export_pdf() : console.warn('btn_export_pdf is null')
btn_export_td ? btn_export_td.onclick = () => export_transfer_data() : console.warn('btn_export_td is null')
btn_import_td ? btn_import_td.onclick = () => import_transfer_data() : console.warn('btn_import_td is null')

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

async function export_transfer_data()
{
    console.log('function export_transfer_data')
    ipcRenderer.invoke('export-transfer-data')
}

async function import_transfer_data()
{
    console.log('function import_transfer_data')
    ipcRenderer.invoke('import-transfer-data')
}