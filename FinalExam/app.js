const express = require('express');
const app = express();
const { eventRouter, memberRouter, attendanceRouter } = require('./routers');
const { LOGGER } = require('./util');

app.use(express.json());
app.use('/api/events', eventRouter);
app.use('/api/members', memberRouter);
app.use('/api/attendance', attendanceRouter);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`Server is now up listening on port ${port}`);
});

process.on('uncaughtException', error => {
	LOGGER.fatal(error.message);
});

process.on('unhandledRejection', error => {
	LOGGER.warn(error.message);
});


function errorHandler (err, req, res, next) {
	if (err.status) {
		res.status(err.status);
	} else {
		res.status(400);
	}
	
	LOGGER.error(err);
	res.json({ error: err });
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};