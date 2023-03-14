/**
 * 
 * @param mainDiv div to be blurred
 */
export function blurBackground(mainDiv:HTMLDivElement) {
    mainDiv.className = 'main-container-blur'
}

/**
 * 
 * @param mainDiv 
 */
export function unblurBackground(mainDiv:HTMLDivElement) {
    mainDiv.className = 'main-container'
}