import { ipcRenderer } from "electron"


const btn_register = document.querySelector('#register') as HTMLDivElement

btn_register ? btn_register.onclick = () => clickRegisterPasswordButton() : console.warn('btn_register is null')
//TODO - HOW TO PASSWORD PROTECT A FOLDER THROUGH ELECTRON - maybe chmod
async function clickRegisterPasswordButton()
{
    //get both divs
    const p1Div = document.querySelector('#password1') as HTMLDivElement
    const p2Div = document.querySelector('#password2') as HTMLDivElement

    //take content of both divs
    const p1 = p1Div.innerText
    const p2 = p2Div.innerText

    //send a message to user to say whether passwords match
    if (p1 != p2)
    {
        alert('Passwords do not match. Please enter the same password twice.')
    }
    else if (p1 == p2) {
        //register passwords if the do match and alert the user
        const message =  await ipcRenderer.invoke('register-password', p1, p2)
        alert(message)
    }
}