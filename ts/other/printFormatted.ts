//see [link](https://gist.github.com/abritinthebay/d80eb99b2726c83feb0d97eab95206c4)
export const terminalColourGreen = '\x1b[32m' //for important information
export const terminalColourRed = "\x1b[31m" // for errors
export const terminalColourYellow = '\x1b[33m' // yellow for warnings
export const terminalColourWhite = '\x1b[37m' // white for regular - just a regualr console log
export const terminalColourBlack = '\x1b[30m' // black if regular if using a light terminal
export const terminalColourBlue = '\x1b[34m' // blue for mark a function being called

type colour = 'green'|'red'|'yellow'|'white'|'black'|'blue'
// export const stringFormatting = terminalColourGreen+'%s%s\x1b[0m'

function stringFormatting(colour:colour, args:number)
{
    var stringFormatting = ''
    switch (colour) {
        case 'green': stringFormatting = terminalColourGreen; break;
        case 'red' : stringFormatting = terminalColourRed; break;
        case 'yellow': stringFormatting = terminalColourYellow; break;
        case 'white': stringFormatting = terminalColourWhite; break;
        case 'black' : stringFormatting = terminalColourBlack; break;
        case 'blue' : stringFormatting = terminalColourBlue; break;
    }
    
    for(var i = 0; i < args; i++) {
        stringFormatting += '%s'//number of string arguments
        if (i == args - 1)
        {
            stringFormatting+='\x1b[0m'//change colour back to normal/default
        }
    }
    return stringFormatting
}
/**
 * A function for printing console output with colour in Node.js terminal
 * @param colour a colour to be used for the ouput (one of six to choose from)
 * @param args an indeterminate amount of string arguments
 */
export function printFormatted(colour:colour, ...args:any[]) {
    const formatting = stringFormatting(colour, args.length)
    console.log(formatting,...args)
}