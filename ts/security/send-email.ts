import nodemailer from 'nodemailer'
import { printFormatted } from '../other/stringFormatting'
import fs from 'fs'
import paths from 'path'


/**
 * Returns the transport object needed for nodemailer
 */
async function getTransport()
{
  const gmailJsonStrPath = paths.join(__dirname, '..','..', 'gmail.json') as string
  const gmailJsonStr = await fs.promises.readFile(gmailJsonStrPath, 'utf-8')
  var gmail:{username:string,app_password:string}
  gmail = JSON.parse(gmailJsonStr)
  let transport = 
  {
    service:'gmail',
    secure: true,//use TLS (the new SSL)
    auth: {
      user:gmail.username,
      pass:gmail.app_password
    },
  }
  return transport
}
// See https://miracleio.me/snippets/use-gmail-with-nodemailer/#enable-2-step-verification
/**
 * Send the reset password email to users.
 * @param recipientEmail user's email address
 * @param resetCode the code for the address
 */
export async function sendResetPasswordEmail(recipientEmail:string, resetCode:string)
{
  const transport = await getTransport();
  const filepath = paths.join(__dirname, '..','..','html','email','reset-password-email.html')
 
  const html = await fs.promises.readFile(filepath,'utf-8')
  
  let mailOptions = 
  {
    from:'"The Journal App" <do-not-reply@the-journal-app.com>',
    to: recipientEmail,
    subject: 'Reset password',
    text: 
    'Thank you for using The Journal App.\n'+
    'Please use this code to login and reset your password.\n'+
    'Code for logging in:'+resetCode,
    html:html+'\n<p>Code for verifying email:'+resetCode+'</p>'
  }
  let transporter = nodemailer.createTransport(transport)

  try 
  {
    const response =  await transporter.sendMail(mailOptions)
    printFormatted('green', 'Email sent successfully:'+response)
  } catch (error:any) 
  {
    printFormatted('red', error.message)
  }
  
}

/**
 * Send verification email to users.
 * @param recipientEmail email to recieve our email
 * @param verificationCode code to help verify the recipient email
 */
export async function sendVerificationEmail(recipientEmail:string, verificationCode:string)
{
  const transport = await getTransport();
  const filepath = paths.join(__dirname, '..','..','html','email','verification-email.html')
  const html = await fs.promises.readFile(filepath,'utf-8')
  let mailOptions = 
  {
    from:'"The Journal App" <do-not-reply@the-journal-app.com>',
    to: recipientEmail,
    subject: 'Reset password',
    text: 
    'Thank you for using The Journal App.\n'+
    'Please use this code to login and reset your password.\n'+
    'Code for logging in:'+verificationCode,
    html:html+'\n<p>Code for verifying email:'+verificationCode+'</p>'
  }
  let transporter = nodemailer.createTransport(transport)

  try 
  {
    const response =  await transporter.sendMail(mailOptions)
    printFormatted('green', 'Email sent successfully:'+response)
  } catch (error:any) 
  {
    printFormatted('red', error.message)
  }
  
}