const { attendanceDataAccess, eventDataAccess, memberDataAccess } = require('../dataAccess');
const { APP_CONSTANTS } = require('../util');
const Joi = require('joi').extend(require('@joi/date'));

/**
 * https://jsdoc.app/
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */


/**
 * Validate if Attendancename or Email Address already exists.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const validateCreateRequest = async (req, res, next) => {
	const payload = req.body;
	const schema = Joi.object({
		eventId: Joi.string().required(),
		memberId: Joi.string().required(),
		timeIn: Joi.date().format(APP_CONSTANTS.DATETIME_FORMAT).utc(),
		timeOut: Joi.date().format(APP_CONSTANTS.DATETIME_FORMAT).utc()
	});

	const { error } = schema.validate(payload);
	if (error) {
		res.status(400).send(error.message);
	}

	const member = await memberDataAccess.getById(payload.memberId);
	if (!member) {
		res.status(400).send(APP_CONSTANTS.ERROR_MESSAGE.MEMBER_RECORD_NOT_FOUND);
	} else {
		req.body.name = member.name;
	}

	const event = await eventDataAccess.getById(payload.eventId);
	if (!event) {
		res.status(400).send(APP_CONSTANTS.ERROR_MESSAGE.EVENT_RECORD_NOT_FOUND);
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
	const id = req.params.id;
	const attendance = await attendanceDataAccess.getById(id);
	if (attendance) {
		await attendanceDataAccess.delete(id);
		res.sendStatus(200);
	} else {
		res.status(404).send(APP_CONSTANTS.ERROR_MESSAGE.ATTENDANCE_RECORD_NOT_FOUND);
	}
};


module.exports = {
	validateCreateRequest,
	insertAttendance,
	deleteAttendance
};
