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
    EVENT_ID: 'eventId',
    MEMBER_ID: 'memberId'
});


const ERROR_MESSAGE = Object.freeze({
    NO_RECORDS_FOUND: 'No records found.',
    MEMBER_RECORD_NOT_FOUND: 'Member record not found.',
    EVENT_RECORD_NOT_FOUND: 'Event record not found.',
    ATTENDANCE_RECORD_NOT_FOUND: 'Attendance record not found.',
    EVENT_DELETE_FAILED_ATTENDANCE_FOUND: 'Unable to delete event. Event has attendance records.',
    MEMBER_DELETE_FAILED_ATTENDANCE_FOUND: 'Unable to member record. Member has attendance records.'
});

module.exports = { STATUS, EVENT_TYPES, DATE_FORMAT, DATETIME_FORMAT, ERROR_MESSAGE, EVENT_PROPS };