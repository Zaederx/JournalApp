import { printFormatted } from '../../other/stringFormatting'
export type keystrokes = {keys:string}


/**
 * Listener for `paste` events for pasting from clipboard.
 * It makes sure that pasting does not contain styling.
 * @param event keyboard event
 */
export function pasteWithoutStyle(event:any)
{
    console.warn('function pasteWithoutStyle called')
    console.log('typeof e:',typeof event)
    
    if (event.clipboardData && event.clipboardData.getData) {
        event.target.textContent = event.clipboardData.getData('text/plain')
        event.preventDefault()//prevents it from pasting twice
    }
}

/**
 * Captures keystrokes in a keystrokes object.
 * Type keystrokes used so that the variable could be declared constant
 * and not be accidentally overwritten/redeclared.
 * @param event `keypress` events
 * @param keystrokes 
 */
export function captureKeystrokes(event:KeyboardEvent, keystrokes:keystrokes)
{
    printFormatted('blue', 'function captureKeystrokes called')
    var keyname = event.key
    // var keycode = event.code
    //save password keystrokes
    keystrokes.keys += keyname
    console.log('passwordKeystrokes:'+keystrokes.keys)
}

/**
 * Deletes keys from var `captureKeystrokes` when characters are deleted
 * from password div.
 * Characters in password div are all the same circle and cannot be used for passwords.
 * To capture actually key press character, the captureKeystrokes function is used.
 * To delete these acurally requires the use of this `deleteKeystrokes` function
 * @param event keyboard event
 */
export async function deleteKeystrokes(event:KeyboardEvent, element:HTMLDivElement, keystrokes:keystrokes)
{
    printFormatted('blue', 'function deleteKeystrokes called')
    printFormatted('green', 'element:',element)
    var keyname = event.key
    //if backspace is pressed - delete the previous keystroke
    if (keyname == 'Backspace')
    {
        keystrokes.keys = element.innerHTML
    }
}




/**
 * Listens for enter keyboard event.
 * Prevents line caret movement downwards 
 * (you know that line that indicates where you are in the text) 
 * and then calls a function that you specify.
 * @param event KeyboardEvent
 * @param func function to be called when enter is pressed
 */
export function submitEnterListener(event:KeyboardEvent, func:Function)
{
    printFormatted('blue','function loginEnterListener called')
    var keyname = event.key
    var keycode = event.code
    // console.log('keyname:'+keyname+', keycode:'+keycode)
    if (keyname == 'Enter')
    {
        //prevent it from having caret movement - i.e. no text cursor movement down
        event.preventDefault()
        //a function - login for example
        func()
    }
}