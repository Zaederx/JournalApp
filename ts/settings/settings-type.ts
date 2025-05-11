import fs from 'fs';
import * as dirs from '../directory'
import { printFormatted } from '../other/printFormatted';

/**
 * The settings type.
 * A representation of settings to be stored
 * on the filesystem.
 */
export type settings = {'password-protection':'true'|'false', 'password-reminder':'true'|'false'}

export const defaults:settings =  {'password-protection':'false','password-reminder':'true'}
