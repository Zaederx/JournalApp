/**
 * Class to represent user information.
 * This class is used when the user tries to 
 * register their email and password in the app.
 */
export class Profile {
    email:string;//plain string
    /**
     * Makes sure to put the HASHED password into the constructor
     */
    passwordHash:string;//hashed
    email_verified:'true'|'false';

    /**
     * Constructor for Profile class.
     * @param email the user's email
     * @param passwordHash password that has been hashed
     * @param email_verified - whether or not the email has been verified.
     * Defaults to true if not specified.
     */
    constructor(email:string, passwordHash:string, email_verified:'true'|'false'='false') {
        this.email = email
        this.passwordHash = passwordHash
        this.email_verified = email_verified
    }
}