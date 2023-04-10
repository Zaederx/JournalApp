function deleteKeyStrokes(event:KeyboardEvent)
{
    const passwordField = document.querySelector('#password') as HTMLDivElement
    var keyname = event.key
    //if backspace is pressed - delete the previous keystroke
    if (keyname == 'Backspace')
    {
        console.log('backspace pressed')
        //get password length
        var p_length = passwordField.innerText.length//needs to be minus one -> because doesn't register the backspace till after
        var s_length = passwordKeystrokes.length
        const first_char = 0

        // const diff = difference(p_length,s_length)
        console.log('p_length:'+p_length)
        console.log('s_length:'+s_length)
        // console.log('difference:'+diff)
         //function should only return positive difference
        
        //remove anything beyong p_length
        passwordKeystrokes = passwordKeystrokes.slice(first_char,p_length)//also needs to be minus 1
        var s_length = passwordKeystrokes.length
        console.log('s_length after slice:'+s_length)
        
        console.log('passwordKeystrokes:'+passwordKeystrokes)
    }
}

function captureKeystrokes(event:KeyboardEvent)
{
    console.log('function captureKeyStrokes listener')
    var keyname = event.key
    // var keycode = event.code
    //save password keystrokes
    passwordKeystrokes += keyname
    console.log('passwordKeystrokes:'+passwordKeystrokes)
}


function loginEnterListener(event: KeyboardEvent)
{
    console.log('function loginEnterLister called')
    var keyname = event.key
    var keycode = event.code
    // console.log('keyname:'+keyname+', keycode:'+keycode)
    if (keyname == 'Enter')
    {
        //prevent it from having caret movement - i.e. no text cursor movement down
        event.preventDefault()
        //login
        clickLogin()
    }
}