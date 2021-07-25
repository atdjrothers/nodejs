const { memberDataAccess } = require('../dataAccess');

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
	const member = await memberDataAccess.getMemberById(req.params.id);
	if (member) {
		res.send(member);
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
	const member = await memberDataAccess.getMemberByProp(req.params.emailAddress, null); //TODO
	if (member) {
		res.send(member);
	} else {
		res.sendStatus(404);
	}
};


/**
 * Validate Required fields.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const validateRequestRequiredPayload = (req, res, next) => {
	const payload = req.body;
	const areAllPropsPresent = ['membername', 'emailAddress'].every(requiredProp => requiredProp in payload);

	if (areAllPropsPresent) {
		return next();
	}

	res.status(400).send('membername/emailAddress must be present in the payload');
};

/**
 * Validate if Membername or Email Address already exists.
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

	if (await memberDataAccess.getMemberByMembername(payload.membername)) {
		return res.status(409).send('Membername already exists.');
	}
	else if (await memberDataAccess.getMemberByEmailAddress(payload.emailAddress)) {
		return res.status(409).send('Email Address already exists.');
	}

	next();
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
	const membername = req.params.membername;
	const member = await memberDataAccess.getMemberByMembername(membername);
	if (!member) {
		return res.status(409).send('Membername does exists.');
	}

	const payload = req.body;
	const payloadPropNames = Object.keys(payload);
	const hasMembername = payloadPropNames.indexOf('membername');
	if (hasMembername > -1) {
		return res.status(400).send('Membername not valid in request payload.');
	}

	if (payloadPropNames.indexOf('emailAddress') < 0) {
		return res.status(409).send('Email Address is required.');
	}

	const emailAddress = payload.emailAddress.toLowerCase();
	if (!validateEmail(emailAddress)) {
		return res.status(409).send('Invalid Email Address.');
	}

	const memberByEmail = await memberDataAccess.getMemberByEmailAddress(emailAddress);
	if (memberByEmail && memberByEmail.membername != membername) {
		return res.status(409).send('Email Address already exists.');
	}

	next();
};

/**
 * Update member.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const updateMember = async (req, res, next) => {
	const membername = req.params.membername;
	const payload = req.body;

	await memberDataAccess.update(membername, payload);

	res.sendStatus(200);
};

/**
 * Delete member.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const deleteMember = async (req, res, next) => {
	const membername = req.params.membername;
	const member = await memberDataAccess.getMemberByMembername(membername);
	if (member) {
		await memberDataAccess.delete(membername);
		res.sendStatus(200);
	} else {
		res.sendStatus(404);
	}

};

/**
 * Validate email.
 */
const validateEmail = (email) => {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

module.exports = {
	getAllMembers,
	getMemberById,
	getMemberByParams,
	validateRequestRequiredPayload,
	validateCreateRequest,
	validateUpdateRequest,
	insertMember,
	updateMember,
	deleteMember
};
