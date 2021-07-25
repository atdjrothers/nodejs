const DataAccess = require('./db');

class EventDataAccess extends DataAccess {
    constructor() {
        super('events');
    }

    async getEventByProp(key, value) {
        const data = await this.getByAny({
            propName: key,
            propValue: value
        });

        return data;
    }
}

module.exports = new EventDataAccess();
