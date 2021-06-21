process.on('uncaughtException', error => {
	console.log(error.message);
});
  
process.on('unhandledRejection', error => {
	console.error(error.message);
});



const fs = require('fs');
const chalk = require('chalk');
const FileNotifier = require('./FileNotifier');
const FileChecker = require('./FileChecker');

class TheWatcher {
	notif = new FileNotifier();
	fileChecker = new FileChecker();
	watch() {
		this.fileChecker.on('openToastNotification', this.openToastNotification);
		this.fileChecker.on('printToConsole', this.printToConsole);

		const argv = process.argv.slice(2).reduce((argv, cmdArg) => {
			const splittedValues = cmdArg.split('=');
			argv[splittedValues[0]] = splittedValues[1];

			return argv;
		}, {});

		const name = argv['--name'];
		const dir = argv['--path'];

		console.log(chalk.green(`Watching path: ${dir}`));

		fs.watch(dir, { }, (eventType, filename) => {
			if (filename) {
				this.fileChecker.checkFile(dir, filename, name);
			}
		});
	}

	openToastNotification = (msg) => {
		this.notif.showNotification(msg);
	};
	
	printToConsole = (msg) => {
		console.log(msg);
	};
}

const watcher = new TheWatcher();

watcher.watch();