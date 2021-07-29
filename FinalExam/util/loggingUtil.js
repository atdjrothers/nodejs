const fs = require('fs').promises;
const chalk = require('chalk');

const LOGGING_LEVELS = Object.freeze({
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    ERROR: 3,
    WARN: 4,
    FATAL: 5,  
});

class LoggingUtil {

    constructor() {
        this.logLevel = LOGGING_LEVELS.DEBUG;
        this.path = './logs/';
    }

    getLogLevels() {
        return LOGGING_LEVELS;
    }

    getFileName() {
        const dateStr = new Date().toISOString().split('T')[0];
        const fileName = `${this.path}AttendanceMonitoringLogs-${dateStr}.txt`;
        return fileName;
    }

    async log(level, message) {
        if (level >= this.logLevel) {
            const fileName = this.getFileName();

            const today = new Date();
            let key = 'DEBUG';
            Object.keys(LOGGING_LEVELS).forEach(function(k) {
                if (LOGGING_LEVELS[k] === level) {
                    key = k;
                }
            });
            let data = `[${today.toISOString()}] [${key}] `;
            if (typeof message === 'object') {
                data = data + `\n${JSON.stringify(message, null, '\t')}\n`
            } else {
                data = data + `${message}\n`;
            }
            
            this.logToConsole(level, message);
            await fs.appendFile(fileName, data);
        }
    }

    logToConsole(level, msg) {
        let message = msg;
        if (typeof msg === 'object') {
            message = JSON.stringify(msg, null, '\t');
        }

        switch(level) {
            case LOGGING_LEVELS.DEBUG:
                console.log(chalk.green(message));
                break;
            case LOGGING_LEVELS.INFO:
                console.log(chalk.blue(message));
                break;
            case LOGGING_LEVELS.ERROR:
                console.log(chalk.red(message));
                break;
            case LOGGING_LEVELS.WARN:
                console.log(chalk.magenta(message));
                break;
            case LOGGING_LEVELS.FATAL:
                console.log(chalk.gray(message));
                break;
            default:
                console.log(mesage);
                break;
        }
    }

    logHttpRequest(req, endpoint) {
        const msg = {
            endpoint: endpoint,
            originalUrl: req.originalUrl,
            headers: req.headers,
            query: req.query,
            params: req.params,
            body: req.body
        };
        this.debug(msg);
    }

    trace(message) {
        this.log(LOGGING_LEVELS.TRACE, message);
    }

    debug(message) {
        this.log(LOGGING_LEVELS.DEBUG, message);
    }

    info(message) {
        this.log(LOGGING_LEVELS.INFO, message);
    }

    error(message) {
        this.log(LOGGING_LEVELS.ERROR, message);
    }

    warn(message) {
        this.log(LOGGING_LEVELS.WARN, message);
    }

    fatal(message) {
        this.log(LOGGING_LEVELS.FATAL, message);
    }
}

module.exports = new LoggingUtil();