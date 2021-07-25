const express = require('express');
const { eventController } = require('../controllers');

const router = express.Router();

router.get('/', eventController.getAllEvents);
// router.get('/search', userController.getUserByUsername);
//router.get('/export', userController.getUserByUsername);

router.post('/',
    eventController.validateRequestRequiredPayload,
    eventController.validateCreateRequest,
    eventController.insertEvent
);

router.put('/',
    eventController.validateUpdateRequest,
    eventController.updateEvent
);

router.delete('/:id', eventController.deleteEvent);

module.exports = router;
