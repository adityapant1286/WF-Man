import moment from 'moment';
import { TIMESTAMP_FORMAT, 
        CONSOLE_COLORS, 
        CON_SYMBOLS } from './constants.js';

let debugOn = false;

export const setDebug = (enable = false) => debugOn = enable;

const _currentTimestamp = () => moment().local().format(TIMESTAMP_FORMAT);

const _logIt = (c, simbol, msg, stringify = false) => console.log(c + '%s - %s - %s' + CONSOLE_COLORS.Reset,
    simbol,
    _currentTimestamp(),
    (stringify ? JSON.stringify(msg, null, 2) : msg));

export const errorLog = (msg, stringify = false) => _logIt(CONSOLE_COLORS.FgRed, 
    CON_SYMBOLS.ERR, 
    msg, 
    stringify);

export const infoLog = (msg, stringify = false) => _logIt(CONSOLE_COLORS.FgGreen, 
    CON_SYMBOLS.INFO, 
    msg, 
    stringify);

export const warnLog = (msg, stringify = false) => _logIt(CONSOLE_COLORS.FgYellow, 
    CON_SYMBOLS.WARN, 
    msg, 
    stringify);
    
export const highlightLog = (msg = '--------------------', stringify = false) => _logIt(CONSOLE_COLORS.FgCyan, 
    CON_SYMBOLS.HIGHLIGHT, 
    stringify ? msg : '------' + msg + '------', 
    stringify);

export const debugLog = (msg, stringify = false) => {
    if (debugOn) {
        console.log(CONSOLE_COLORS.FgMagenta + '%s - %s - %s' + CONSOLE_COLORS.Reset,
            CON_SYMBOLS.DEBUG,
            _currentTimestamp(),
            (stringify ? JSON.stringify(msg, null, 2) : msg));
    }
};
