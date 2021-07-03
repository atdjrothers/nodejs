const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/user/:username', userController.getUserByUsername);
router.get('/user/email/:emailAddress', userController.getUserByEmailAddress);

router.post('/',
    userController.validateRequestRequiredPayload,
    userController.validateCreateRequest,
    userController.insertUser
);

router.put('/user/:username',
    userController.validateUpdateRequest,
    userController.updateUser
);

router.delete('/user/:username', userController.deleteUser);

module.exports = router;
