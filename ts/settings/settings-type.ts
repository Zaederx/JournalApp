
export type settings = {'password-protection':'true'|'false', 'password-reminder':'true'|'false'}

export class Settings {
    //password protection is false by default because there hasnt been a password set
    // but application will prompt the user turn it on and set a password 
    static defaults:settings =  {'password-protection':'false','password-reminder':'true'}
}