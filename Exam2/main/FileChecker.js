const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const FileNotifier = require('./FileNotifier');
const { EventEmitter } = require('stream');

class FileChecker extends EventEmitter {
    notif = new FileNotifier();
    async checkFile(dir, filename, name) {
        const filePath = path.join(dir, filename);
		await fs.readFile(filePath, (e, data) => {
            if (!e) {
                this.checkContents(data, filename, name);
            }
        });
    }

    checkContents(data, filename, name) {
        if (data) {
            const str = data.toString().toLowerCase();
            const simpleName = name.toLowerCase();
            if (str.includes(simpleName)) {
                const msg = `Your name ${name} was mentioned in file: ${filename}`;
                this.emit('openToastNotification', msg);
                this.emit('printToConsole', msg);
            }
        }
    }
}

module.exports = FileChecker;