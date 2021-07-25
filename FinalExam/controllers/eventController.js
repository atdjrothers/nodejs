const { eventDataAccess } = require('../dataAccess');

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
	const output = await eventDataAccess.getById(req.params.id);
	if (output) {
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
	// const user = await eventDataAccess.getUserByEmailAddress(req.params.emailAddress);
	// if (user) {
	// 	res.send(user);
	// } else {
	// 	res.sendStatus(404);
	// }
};


/**
 * Validate Required fields.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const validateRequestRequiredPayload = (req, res, next) => {
	const payload = req.body;
	const areAllPropsPresent = ['username', 'emailAddress'].every(requiredProp => requiredProp in payload);

	if (areAllPropsPresent) {
		return next();
	}

	res.status(400).send('username/emailAddress must be present in the payload');
};

/**
 * Validate if Username or Email Address already exists.
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

	if (await eventDataAccess.getUserByUsername(payload.username)) {
		return res.status(409).send('Username already exists.');
	}
	else if (await eventDataAccess.getUserByEmailAddress(payload.emailAddress)) {
		return res.status(409).send('Email Address already exists.');
	}

	next();
};


/**
 * Inserts user.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const insertEvent = async (req, res, next) => {
	const payload = req.body;

	const user = await eventDataAccess.insert(payload);

	res.status(201).send(user);
};

/**
 * Validate Update Request Payload
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const validateUpdateRequest = async (req, res, next) => {
	const payload = req.body;
	const id = payload.id;
	const data = await eventDataAccess.getById(id);
	if (!data) {
		return res.status(409).send('Username does exists.');
	}


	const payloadPropNames = Object.keys(payload);
	const hasUsername = payloadPropNames.indexOf('username');
	if (hasUsername > -1) {
		return res.status(400).send('Username not valid in request payload.');
	}

	if (payloadPropNames.indexOf('emailAddress') < 0) {
		return res.status(409).send('Email Address is required.');
	}

	const emailAddress = payload.emailAddress.toLowerCase();
	if (!validateEmail(emailAddress)) {
		return res.status(409).send('Invalid Email Address.');
	}

	const userByEmail = await eventDataAccess.getUserByEmailAddress(emailAddress);
	if (userByEmail && userByEmail.username != username) {
		return res.status(409).send('Email Address already exists.');
	}

	next();
};

/**
 * Update user.
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
 * Delete user.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const deleteEvent = async (req, res, next) => {
	const id = req.params.id;
	const user = await eventDataAccess.getById(id);
	if (user) {
		await eventDataAccess.delete(id);
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
	getAllEvents,
	// getUserByUsername,
	// getUserByEmailAddress,
	validateRequestRequiredPayload,
	validateCreateRequest,
	validateUpdateRequest,
	insertEvent,
	updateEvent,
	deleteEvent
};
