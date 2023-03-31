/**
 * 
 * @param mainDiv div to be blurred
 */
export function blurBackground(mainDiv:HTMLElement) {
    console.log('function blurBackground called')
    mainDiv.className = 'main-container-blur'
}

/**
 * 
 * @param mainDiv 
 */
export function unblurBackground(mainDiv:HTMLElement) {
    console.log('function unblurBackground called')
    mainDiv.className = 'main-container'
}