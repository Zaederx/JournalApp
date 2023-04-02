
export type settings = {'password-protection':'true'|'false', 'password-reminder':'true'|'false'}

export class Settings {
    static defaults:settings =  {'password-protection':'true', 'password-reminder':'true'}
}