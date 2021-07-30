const express = require('express');
const { attendanceController } = require('../controllers');

const router = express.Router();

router.get('/', attendanceController.getAllAttendance);
router.get('/:id', attendanceController.getAttendanceById);

router.post('/',
    attendanceController.validateCreateRequest,
    attendanceController.insertAttendance
);

router.put('/',
    attendanceController.validateUpdateRequest,
    attendanceController.updateAttendance
);

router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
