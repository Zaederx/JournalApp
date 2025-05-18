# Todo
Main/big todo's that should be noted down so that something can be down about, and also not to forget what each issue is about.

## Make email password registration use new email-verified.json file
Make sure that you are checking that the email against email stored in email-verified.json instead of against the email hash. New email-verified.json replaces verified.txt and eamil.txt/email-hash.txt. Reason for this is because sometimes you could have an old verified.txt with a new email. Whereas if the email-verified.json is updated all at one everytime an email is submitted, it resolves the problem.

## ✅ Get emailIsVerified function to send alerts to frontend

## Make an editable function - npm package
Make a function with css for changing divs into editable divs.

## Make sure that dialogs have a close button / x
Currently dialogs don't have a close button, so they remain open until either used of you click on something in the navigation.

## ✅ Make sure that verification email isn't resent when resetting password
If email doesn't match the email you have stored and verified, then send the verification email again. If an email has been verified and the email given matches the stored email hash, then don't send the verification email again.

## Clean up unwanted HTML dialogs that aren't used
Because I used the the general purpose custom prompt for single response prompting, I've not used some of the HTML dialogs fragments that I've made. Need to remove the ones that I don't use.

## ✅ Reset password functionality 
Put reset password functionality. (When you want to change your password from settings.)

## Forgot password functionality
When your about to login but have forgotten your password, there should be a 'forgot your password' button and functionality. (mainly in login.ts). Currently `forgot password` button takes you to settings.html if not already there, but hte login dialog pop up again. Need to make that stop popping up and go straight to custom prompt.

## Make sure that password can be hidden

## ✅ Fix User Access 
login.ts should be called at the start of loading the app to make sure that you can login.

## Add theme to settings file???
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

## Maybe add boolean option for password visibility in login dialog 
Put javascript for dealing with password visibility after dialog has been loaded into the HTML DOM.



## Remember: You might need to change 'on blur' response for authentication...
Make sure that blurring the screen isn't linked to authentication/ logging out the user any more. Just in case you want to blur the screen for any other reason, the app shouldn't 


