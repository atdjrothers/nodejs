const { attendanceDataAccess } = require('../dataAccess');

/**
 * https://jsdoc.app/
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Validate Required fields.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const validateRequestRequiredPayload = (req, res, next) => {
	const payload = req.body;
	const areAllPropsPresent = ['attendancename', 'emailAddress'].every(requiredProp => requiredProp in payload);

	if (areAllPropsPresent) {
		return next();
	}

	res.status(400).send('attendancename/emailAddress must be present in the payload');
};

/**
 * Validate if Attendancename or Email Address already exists.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const validateCreateRequest = async (req, res, next) => {
	const payload = req.body;

	const emailAddress = payload.emailAddress;
	if (!validateEmail(emailAddress)) {
		return res.status(409).send('Invalid Email Address.');
	}

	if (await attendanceDataAccess.getAttendanceByAttendancename(payload.attendancename)) {
		return res.status(409).send('Attendancename already exists.');
	}
	else if (await attendanceDataAccess.getAttendanceByEmailAddress(payload.emailAddress)) {
		return res.status(409).send('Email Address already exists.');
	}

	next();
};


/**
 * Inserts attendance.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const insertAttendance = async (req, res, next) => {
	const payload = req.body;

	const attendance = await attendanceDataAccess.insert(payload);

	res.status(201).send(attendance);
};


/**
 * Delete attendance.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const deleteAttendance = async (req, res, next) => {
	const attendancename = req.params.attendancename;
	const attendance = await attendanceDataAccess.getAttendanceByAttendancename(attendancename);
	if (attendance) {
		await attendanceDataAccess.delete(attendancename);
		res.sendStatus(200);
	} else {
		res.sendStatus(404);
	}

};


module.exports = {
	validateRequestRequiredPayload,
	validateCreateRequest,
	insertAttendance,
	deleteAttendance
};
