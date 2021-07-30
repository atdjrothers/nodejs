const { attendanceDataAccess, eventDataAccess, memberDataAccess } = require('../dataAccess');
const { APP_CONSTANTS, ERROR_HANDLER, LOGGER } = require('../util');
const Joi = require('joi').extend(require('@joi/date'));

/**
 * https://jsdoc.app/
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */


/**
 * Gets all attendance
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
 const getAllAttendance = async (req, res, next) => {
	LOGGER.logHttpRequest(req, 'getAllAttendance');
	const output = await attendanceDataAccess.getAll();
	res.send(output);
};

/**
 * Get attendance by id.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
 const getAttendanceById = async (req, res, next) => {
	LOGGER.logHttpRequest(req, 'getAttendanceById');
	const data = await attendanceDataAccess.getById(req.params.id);
	if (data) {
		res.send(data);
	} else {
		next(ERROR_HANDLER.createErrorResponse(APP_CONSTANTS.ERROR_MESSAGE.EVENT_RECORD_NOT_FOUND, 404, APP_CONSTANTS.ERROR_TYPES.RECORD_NOT_FOUND));
	}
};



/**
 * Validate if Attendancename or Email Address already exists.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const validateCreateRequest = async (req, res, next) => {
	LOGGER.logHttpRequest(req, 'insertAttendance');
	const payload = req.body;
	const schema = Joi.object({
		eventId: Joi.string().required(),
		memberId: Joi.string().required(),
		timeIn: Joi.date().format(APP_CONSTANTS.DATETIME_FORMAT).utc().less(Joi.ref('timeOut')).required(),
		timeOut: Joi.date().format(APP_CONSTANTS.DATETIME_FORMAT).utc()
	});

	const { error } = schema.validate(payload);
	if (error) {
		next(ERROR_HANDLER.createErrorResponse(error.message, 400, APP_CONSTANTS.ERROR_TYPES.VALIDATION_ERROR));
	}

	const member = await memberDataAccess.getById(payload.memberId);
	if (!member) {
		next(ERROR_HANDLER.createErrorResponse(APP_CONSTANTS.ERROR_MESSAGE.MEMBER_RECORD_NOT_FOUND, 400, APP_CONSTANTS.ERROR_TYPES.INTEGRITY_CONSTRAINT));
	} else {
		req.body.name = member.name;
	}

	const event = await eventDataAccess.getById(payload.eventId);
	if (!event) {
		next(ERROR_HANDLER.createErrorResponse(APP_CONSTANTS.ERROR_MESSAGE.EVENT_RECORD_NOT_FOUND, 400, APP_CONSTANTS.ERROR_TYPES.INTEGRITY_CONSTRAINT));
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
 * Validate Update Request Payload
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
 const validateUpdateRequest = async (req, res, next) => {
	LOGGER.logHttpRequest(req, 'updateAttendance');
	const payload = req.body;
	const schema = Joi.object({
		id: Joi.string().required(),
		eventId: Joi.string().required(),
		memberId: Joi.string().required(),
		name: Joi.string(),
		timeIn: Joi.date().format(APP_CONSTANTS.DATETIME_FORMAT).utc().less(Joi.ref('timeOut')).required(),
		timeOut: Joi.date().format(APP_CONSTANTS.DATETIME_FORMAT).utc()
	});

	const { error } = schema.validate(payload);
	if (error) {
		next(ERROR_HANDLER.createErrorResponse(error.message, 400, APP_CONSTANTS.ERROR_TYPES.VALIDATION_ERROR));
	}

	const attendance = await attendanceDataAccess.getById(payload.id);
	if (!attendance) {
		next(ERROR_HANDLER.createErrorResponse(APP_CONSTANTS.ERROR_MESSAGE.ATTENDANCE_RECORD_NOT_FOUND, 404, APP_CONSTANTS.ERROR_TYPES.RECORD_NOT_FOUND));
	}

	const member = await memberDataAccess.getById(payload.memberId);
	if (!member) {
		next(ERROR_HANDLER.createErrorResponse(APP_CONSTANTS.ERROR_MESSAGE.MEMBER_RECORD_NOT_FOUND, 400, APP_CONSTANTS.ERROR_TYPES.INTEGRITY_CONSTRAINT));
	} else {
		req.body.name = member.name;
	}

	const event = await eventDataAccess.getById(payload.eventId);
	if (!event) {
		next(ERROR_HANDLER.createErrorResponse(APP_CONSTANTS.ERROR_MESSAGE.EVENT_RECORD_NOT_FOUND, 400, APP_CONSTANTS.ERROR_TYPES.INTEGRITY_CONSTRAINT));
	}

	next();
};


/**
 * Update attendance.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const updateAttendance = async (req, res, next) => {
	const payload = req.body;
	await attendanceDataAccess.update(payload);
	res.sendStatus(200);
};


/**
 * Delete attendance.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const deleteAttendance = async (req, res, next) => {
	LOGGER.logHttpRequest(req, 'deleteAttendance');
	const id = req.params.id;
	const attendance = await attendanceDataAccess.getById(id);
	if (attendance) {
		await attendanceDataAccess.delete(id);
		res.sendStatus(200);
	} else {
		next(ERROR_HANDLER.createErrorResponse(APP_CONSTANTS.ERROR_MESSAGE.ATTENDANCE_RECORD_NOT_FOUND, 404, APP_CONSTANTS.ERROR_TYPES.RECORD_NOT_FOUND));
	}
};


module.exports = {
	getAllAttendance,
	getAttendanceById,
	validateCreateRequest,
	insertAttendance,
	validateUpdateRequest,
	updateAttendance,
	deleteAttendance
};
