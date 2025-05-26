# Todo
Main/big todo's that should be noted down so that something can be done about them, and also not to forget what each issue is about.
 
## ✅ Remove the `.json` extension from entries in the entry list.
Need to make sure that entries can still be opened though, because you will need to add back the extension somewhere before reading the file (cause it search for the file that matches the name and extension) based on the name no the tag.

## ✅ Make 'all' tag always the top when opening the app
Thought this was sorted long ago, but seemed to find a bug where this does not apply. Need to make sure that this is always the top folder in every case.

## ✅ Make sure dialog for entering password before turning off password protection has characters hidden
The dialog for entering your password before turning off password protection does not have the characters hidden currently. Need to fix that. Either use the login dialog or modify the customPrompt dialog.

## ✅ Make sure that emailStored variable is used when saving email and password

## Make sure that if more than one verification code is sent that the timer resets and does not delete the new code before time.
For example if you register your email again after your registered it just before. Maybe there should be a timer for when you can register your email, so that you can't register with 30 mins of each other as long as the email was sent sucessfully. I'm not really sure how to approach this one.

## ✅ Make sure email-password registration dialog closes when clicking register or pressing enter

## ✅ Set 30 min time out for verification password use.
Set a timer to remove the stored verification password, so that it can't be used after a period of time. You don't want a stored code being unused and then being used years later by someone who have hacked into an account. The hacker would then be able to set a password of their choice to the user's app.

## Work on setting up different users??? Maybe...

## ✅ Add password validation - at least make sure that the password is not saved empty
On the email password dialog, make sure that there is some validation on the frontend to ensure that the password is strong.

## Make sure to restyle the email password dialog
The 'x' for closing the email password dialog is in a long red block, because the dialog has display set to grid. It works and looks ok, but I'd prefer it to be `display:block` so that the x can `float:right`, but that means I'll need to reposition all the other stuff in the dialog.

## ✅ Make sure that email actually gets saved in email-verified.json
So far when attempting to save email and password, the email does not get stored in `email-verified.json`. Still think there's a bit of code saving it to `email.txt` or something.

## Change printformatted-js to only return a formatted string which you can then print to console.
This is because printing from the package as it is, hides when the log is comming from. Console usually tells you which line of a file a print comes from, but it just says the the print comes from the package printFormatted.js file in the package, which isnt helpful.

## ✅ Should have to enter password to turn off password protection
Wasn't a problem before, because you couldn't get to the settings page without first logging in.

## ✅ Make sure login dialog doesn't pop up when you click forgot password
Login dialog pops up when you click forgot password, as it takes you to settings.

## ✅ Make email password registration use new email-verified.json file - see ipcMain.handle('register-email-password',)
Make sure that you are checking that the email against email stored in email-verified.json instead of against the email hash. New email-verified.json replaces verified.txt and eamil.txt/email-hash.txt. Reason for this is because sometimes you could have an old verified.txt with a new email. Whereas if the email-verified.json is updated all at one everytime an email is submitted, it resolves the problem.

## ✅ Get emailIsVerified function to send alerts to frontend

## Make an editable function - npm package
Take the function with css for changing divs into editable divs and make it into an npm package.

## ✅ Make sure that dialogs have a close button / x
Currently dialogs don't have a close button, so they remain open until either used of you click on something in the navigation.

## ✅ Make sure that verification email isn't resent when resetting password
If email doesn't match the email you have stored and verified, then send the verification email again. If an email has been verified and the email given matches the stored email hash, then don't send the verification email again.

## ✅ Clean up unwanted HTML dialogs that aren't used
Because I used the the general purpose custom prompt for single response prompting, I've not used some of the HTML dialogs fragments that I've made. Need to remove the ones that I don't use.

## ✅ Reset password functionality 
Put reset password functionality. (When you want to change your password from settings.)

## ✅ Forgot password functionality
When your about to login but have forgotten your password, there should be a 'forgot your password' button and functionality. (mainly in login.ts). Currently `forgot password` button takes you to settings.html if not already there, but hte login dialog pop up again. Need to make that stop popping up and go straight to custom prompt.

## ✅ Make sure that password can be hidden
## Make sure passwords can be displayed

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


