const { memberDataAccess, attendanceDataAccess } = require('../dataAccess');
const { APP_CONSTANTS } = require('../util');
const Joi = require('joi').extend(require('@joi/date'));

/**
 * https://jsdoc.app/
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Gets all members
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getAllMembers = async (req, res, next) => {
	const members = await memberDataAccess.getAll();

	res.send(members);
};

/**
 * Gets member by id.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getMemberById = async (req, res, next) => {
	const member = await memberDataAccess.getById(req.params.id);
	if (member) {
		const attendance = await attendanceDataAccess.getAllAttendanceByProp(APP_CONSTANTS.EVENT_PROPS.MEMBER_ID, req.params.id);
		const output = { ...member, attendance }
		res.send(output);
	} else {
		res.sendStatus(404);
	}
};

/**
 * Gets member by parameters.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getMemberByParams = async (req, res, next) => {
	const name = req.query.name;
	const status = req.query.status;
	let obj = {};
	if (name) {
		obj = { ...obj, name };
	}

	if (status) {
		obj = { ...obj, status };
	}

	const output = await memberDataAccess.getAllFilterByProps(obj);
	if (output) {
		res.send(output);
	} else {
		res.status(404).send(APP_CONSTANTS.ERROR_MESSAGE.NO_RECORDS_FOUND);
	}
};


/**
 * Validate if Membername or Email Address already exists.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const validateCreateRequest = async (req, res, next) => {
	const payload = req.body;

	const schema = Joi.object({
		name: Joi.string().required(),
		// name: Joi.string().pattern("/^[a-z ,.'-]+$/i").required(),
		status: Joi.any().valid(...Object.values(APP_CONSTANTS.STATUS)).required(),
		joinedDate: Joi.date().format(APP_CONSTANTS.DATE_FORMAT).utc()
	});

	const { error } = schema.validate(payload);
	if (error) {
		res.status(400).send(error.message);
	} else {
		next();
	}
};


/**
 * Inserts member.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const insertMember = async (req, res, next) => {
	const payload = req.body;

	const member = await memberDataAccess.insert(payload);

	res.status(201).send(member);
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
		name: Joi.string().required(),
		status: Joi.any().valid(...Object.values(APP_CONSTANTS.STATUS)).required(),
		joinedDate: Joi.date().format(APP_CONSTANTS.DATE_FORMAT).utc()
	});

	const { error } = schema.validate(payload);
	if (error) {
		res.status(400).send(error.message);
	} else {
		next();
	}
};

/**
 * Update member.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const updateMember = async (req, res, next) => {
	const payload = req.body;
	await memberDataAccess.updateMember(payload);
	res.sendStatus(200);
};

/**
 * Delete member.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const deleteMember = async (req, res, next) => {
	const id = req.params.id;
	const member = await memberDataAccess.getById(id);
	if (member) {
		const attendance = await attendanceDataAccess.getAttendanceByProp(APP_CONSTANTS.EVENT_PROPS.MEMBER_ID, id);
		if (attendance) {
			res.status(400).send(APP_CONSTANTS.ERROR_MESSAGE.MEMBER_DELETE_FAILED_ATTENDANCE_FOUND);
		} else {
			await memberDataAccess.delete(id);
			res.sendStatus(200);
		}

	} else {
		res.sendStatus(404);
	}
};

module.exports = {
	getAllMembers,
	getMemberById,
	getMemberByParams,
	validateCreateRequest,
	validateUpdateRequest,
	insertMember,
	updateMember,
	deleteMember
};
