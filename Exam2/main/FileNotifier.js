const notifier = require('node-notifier');

class FileNotifier {

    showNotification(notificationMsg, notificationTitle) {
        notifier.notify({
            title: notificationTitle != null ? notificationTitle : 'Shoutout',
            message: notificationMsg
        });
    }
    
}

module.exports = FileNotifier;