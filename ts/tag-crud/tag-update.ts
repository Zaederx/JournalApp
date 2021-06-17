
const btn_tUpdate = document.querySelector('#t-update') as HTMLButtonElement
const popUpInputDiv = document.querySelector('#pop-up-input-div') as HTMLDivElement
const popUpInput:HTMLInputElement = document.querySelector('#pop-up-input') as HTMLInputElement
const popUpSubmit = document.querySelector('#pop-up-submit') as HTMLButtonElement

btn_tUpdate ? btn_tUpdate.onclick = () => displayInput() : console.log('btn_tUpdate is null')
popUpSubmit ? popUpSubmit.onclick = async () => submitNewTagName() : console.log('popUpSubmit is null')

//set in tag-read.ts in makeClickable function - sets current tagName
var currentTagName:string = ''

function displayInput() {
     //display input
     popUpInputDiv.style.display = 'block'
}

async function submitNewTagName() {
    console.log('*** updateTagName ***')
    var newTagName = popUpInput.value
    console.log('currentTagName:',currentTagName,'newTagName:',newTagName)
    try {
        var message = await window.tagCRUD.update(currentTagName,newTagName)
        console.log('Message:',message)
    }
    catch (error){
        console.log(error)
    }
    
    //display input
    popUpInputDiv.style.display = 'none'
    displayTagView()
    refresh()
}
