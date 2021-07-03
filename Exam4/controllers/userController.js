const { userDataAccess } = require('../dataAccess');

/**
 * https://jsdoc.app/
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Gets all users
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getAllUsers = async (req, res, next) => {
	const users = await userDataAccess.getAll();

	res.send(users);
};

/**
 * Gets user by username.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getUserByUsername = async (req, res, next) => {
	const user = await userDataAccess.getUserByUsername(req.params.username);
	if (user) {
		res.send(user);
	} else {
		res.sendStatus(404);
	}
};

/**
 * Gets user by email address.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getUserByEmailAddress = async (req, res, next) => {
	const user = await userDataAccess.getUserByEmailAddress(req.params.emailAddress);
	if (user) {
		res.send(user);
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

	if (await userDataAccess.getUserByUsername(payload.username)) {
		return res.status(409).send('Username already exists.');
	}
	else if (await userDataAccess.getUserByEmailAddress(payload.emailAddress)) {
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
const insertUser = async (req, res, next) => {
	const payload = req.body;

	const user = await userDataAccess.insert(payload);

	res.status(201).send(user);
};

/**
 * Validate Update Request Payload
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
 const validateUpdateRequest = async (req, res, next) => {
	const username = req.params.username;
	const user = await userDataAccess.getUserByUsername(username);
	if (!user) {
		return res.status(409).send('Username does exists.');
	}

	const payload = req.body;
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

	const userByEmail = await userDataAccess.getUserByEmailAddress(emailAddress);
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
const updateUser = async (req, res, next) => {
	const username = req.params.username;
	const payload = req.body;

	await userDataAccess.update(username, payload);

	res.sendStatus(200);
};

/**
 * Delete user.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const deleteUser = async (req, res, next) => {
	const username = req.params.username;
	const user = await userDataAccess.getUserByUsername(username);
	if (user) {
		await userDataAccess.delete(username);
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
	getAllUsers,
	getUserByUsername,
	getUserByEmailAddress,
	validateRequestRequiredPayload,
	validateCreateRequest,
	validateUpdateRequest,
	insertUser,
	updateUser,
	deleteUser
};
