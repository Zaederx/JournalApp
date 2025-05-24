
/**
 * Check whether an email is valid or not.
 * @param email email to be tested
 */
export function validEmail(email:string)
{
    const validate = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
    return validate.test(email)
}


/**
 * Check whether a password is valid or not.
 * 
 * A valid password in this case is described as:
 * - having a number
 * - having a special character
 * - has an upper case letter
 * - has a lowercase letter
 * - is at least 8 characters long
 * 
 * Usage:
 *```
 * var { valid, hasNumber, hasSpecialCharacter, hasUpperCaseLetter, hasLowerCaseLetter, is8CharLong } = validatorObj
 * //then do what you need to with the booleans
 *```
 * @param email email to be tested
 * @return validatorObj: {valid:boolean, hasNumber:boolean, hasSpecialCharacter:boolean, hasUpperCaseLetter:boolean, hasLowerCaseLetter:boolean, is8CharLong:boolean}
 */
export function validPassword(password:string)
{
    const hasNumberTest = new RegExp(/[1-9]/g)
    const hasSpecialCharacterTest = new RegExp(/[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/)
    const hasUpperCaseLetterTest = new RegExp(/[A-Z]/)
    const hasLowerCaseLetterTest = new RegExp(/[a-z]/)

    var validatorObj = { valid:false, hasNumber:false, hasSpecialCharacter:false, hasUpperCaseLetter:false, hasLowerCaseLetter:false, is8CharLong:false }
    
    validatorObj.hasNumber = hasNumberTest.test(password)
    validatorObj.hasSpecialCharacter = hasSpecialCharacterTest.test(password)
    validatorObj.hasUpperCaseLetter = hasUpperCaseLetterTest.test(password)
    validatorObj.hasLowerCaseLetter = hasLowerCaseLetterTest.test(password)
    validatorObj.is8CharLong = (password.length >= 8)

    var { hasNumber, hasSpecialCharacter, hasUpperCaseLetter, hasLowerCaseLetter, is8CharLong } = validatorObj

    if (hasNumber && hasSpecialCharacter && hasUpperCaseLetter && hasLowerCaseLetter && is8CharLong) {
        validatorObj.valid = true
    }

    return validatorObj
}