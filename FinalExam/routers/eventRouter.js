const express = require('express');
const { eventController } = require('../controllers');

const router = express.Router();

router.get('/search?', eventController.getEventByParams);
router.get('/export?', eventController.exportEventById);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

router.post('/',
    eventController.validateCreateRequest,
    eventController.insertEvent
);

router.put('/',
    eventController.validateUpdateRequest,
    eventController.updateEvent
);

router.delete('/:id', eventController.deleteEvent);

module.exports = router;
