const STATUS = Object.freeze({
    ACTIVE: 'Active',
    INACTIVE: 'In-active'
});

const EVENT_TYPES = Object.freeze({
    MEETING: 'Meeting',
    BROWNBAG: 'BrownBag',
    MASTERS: 'Masters',
    KNOWLEDGE_TRANSFER: 'Knowledge Transfer'
});

const DATE_FORMAT = 'YYYY-MM-DD';
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

const EVENT_PROPS = Object.freeze({
    EVENT_ID: 'eventId'
});


const ERROR_MESSAGE = Object.freeze({
    MEMBER_RECORD_NOT_FOUND: 'Member record not found.',
    EVENT_RECORD_NOT_FOUND: 'Event record not found.',
    ATTENDANCE_RECORD_NOT_FOUND: 'Attendance record not found.',
});

module.exports = { STATUS, EVENT_TYPES, DATE_FORMAT, DATETIME_FORMAT, ERROR_MESSAGE, EVENT_PROPS };