const Joi = require('joi').extend(require('@joi/date'));
const { APP_CONSTANTS } = require('../util');
const { eventDataAccess, attendanceDataAccess } = require('../dataAccess');

/**
 * https://jsdoc.app/
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Gets all events
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getAllEvents = async (req, res, next) => {
	const output = await eventDataAccess.getAll();
	res.send(output);
};

/**
 * Get event by id.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getEventById = async (req, res, next) => {
	const data = await eventDataAccess.getById(req.params.id);
	if (data) {
		const attendance = await attendanceDataAccess.getAllAttendanceByProp(APP_CONSTANTS.EVENT_PROPS.EVENT_ID, req.params.id);
		const output = { ...data, attendance }
		res.send(output);
	} else {
		res.sendStatus(404);
	}
};

/**
 * Gets event by event name.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getEventByParam = async (req, res, next) => {
	res.sendStatus(404).send('TODO missing implementation');
};

/**
 * Validate request payload before creating event.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const validateCreateRequest = async (req, res, next) => {
	const payload = req.body;
	const schema = Joi.object({
		eventName: Joi.string().required(),
		eventType: Joi.string().valid(...Object.values(APP_CONSTANTS.EVENT_TYPES)).required(),
		startDate: Joi.date().format(APP_CONSTANTS.DATETIME_FORMAT).utc().less(Joi.ref('endDate')).required(),
		endDate: Joi.date().format(APP_CONSTANTS.DATETIME_FORMAT).utc().required()
	});
	
	const { error } = schema.validate(payload);
	if (error) {
		res.status(400).send(error.message);
	} else {
		next();
	}
};


/**
 * Inserts event.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const insertEvent = async (req, res, next) => {
	const payload = req.body;

	const event = await eventDataAccess.insert(payload);

	res.status(201).send(event);
};

/**
 * Validate Update Request Payload
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const validateUpdateRequest = async (req, res, next) => {
	const payload = req.body;
	const schema = Joi.object({
		id: Joi.string().required(),
		eventName: Joi.string().required(),
		eventType: Joi.string().valid(...Object.values(APP_CONSTANTS.EVENT_TYPES)).required(),
		startDate: Joi.date().format(APP_CONSTANTS.DATETIME_FORMAT).utc().less(Joi.ref('endDate')).required(),
		endDate: Joi.date().format(APP_CONSTANTS.DATETIME_FORMAT).utc().required()
	});

	const { error } = schema.validate(payload);
	if (error) {
		res.status(400).send(error.message);
	}

	const event = await eventDataAccess.getById(payload.id);
	if (!event) {
		res.status(400).send(APP_CONSTANTS.ERROR_MESSAGE.EVENT_RECORD_NOT_FOUND);
	}

	console.log('validateUpdateRequest=', error, event);
	next();
};

/**
 * Update event.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const updateEvent = async (req, res, next) => {
	const payload = req.body;
	await eventDataAccess.update(payload);
	res.sendStatus(200);
};

/**
 * Delete event.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const deleteEvent = async (req, res, next) => {
	const id = req.params.id;
	const event = await eventDataAccess.getById(id);
	if (event) {
		await eventDataAccess.delete(id);
		const attendance = await attendanceDataAccess.getAllAttendanceByProp(APP_CONSTANTS.EVENT_PROPS.EVENT_ID, id);
		const length = attendance.length;
		for(let i = 0; i < length; i++) {
			const obj = attendance[i];
			await attendanceDataAccess.delete(obj.id);
		}

		res.sendStatus(200);
	} else {
		res.sendStatus(404).send(APP_CONSTANTS.ERROR_MESSAGE.EVENT_RECORD_NOT_FOUND);
	}

};

module.exports = {
	getAllEvents,
	getEventById,
	validateCreateRequest,
	validateUpdateRequest,
	insertEvent,
	updateEvent,
	deleteEvent
};
