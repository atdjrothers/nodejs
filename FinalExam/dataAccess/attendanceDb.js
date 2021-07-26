const DataAccess = require('./db');

class AttendanceDataAccess extends DataAccess {
    constructor() {
        super('attendance');
    }

    async getAttendanceByProp(key, value) {
        const data = await this.getByAny({
            propName: key,
            propValue: value
        });

        return data;
    }

    async getAllAttendanceByProp(propName, value) {
        const data = await this.getAllByProp({
            propName: propName,
            propValue: value
        });

        return data;
    }
}

module.exports = new AttendanceDataAccess();
