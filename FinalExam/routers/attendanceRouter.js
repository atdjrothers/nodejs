const express = require('express');
const { attendanceController } = require('../controllers');

const router = express.Router();

router.post('/',
    attendanceController.validateCreateRequest,
    attendanceController.insertAttendance
);

router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
