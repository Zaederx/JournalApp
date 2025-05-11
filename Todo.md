# Todo
Main/big todo's that should be noted down so that something can be down about, and also not to forget what each issue is about.

## Reset password
Put reset password functionality.

## Fix User Access
login.ts should be called at the start of loading the app to make sure that you can login.

## Add theme to settings file
Maybe add the app theme to the settings file instead of having a separate file for it.
At least make sure that the theme settings file in in the `Application Support/the-journal-app` folder instead of in the css folder.

## Make an npm package for common functions needed for dealing with HTML fields OR editable divs in typescript.
I tend to use editable divs for things because they can be styled, unlike fields.
I can save a package with function for things like:
- email validation (regex)
- password validation (regex)
- pasteWithoutStyle
Note: email validation code
```
/**
 * Check whether an email is valid or not.
 * @param email email to be tested
 */
export function validEmail(email:string)
{
    const validate = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
    return validate.test(email)
}
```

## Maybe add boolean option for password visibility in login prompt 



## Check that the keystrokes of the password field gets deleted when you hit backspace. - login.ts and key-capture.ts
Check the openLoginDialog funtion in `login.ts` and add the code for it. Something along the lines of an event lisenter on the password field, with the function `deleteKeyStrokes`


## Remember: You might need to change 'on blur' response for authentication
Make sure that blurring the screen isn't linked to authentication/ logging out the user any more. Just in case you want to blur the screen for any other reason, the app shouldn't 


