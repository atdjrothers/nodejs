const DataAccess = require('./db');

class MemberDataAccess extends DataAccess {
    constructor() {
        super('members');
    }

    async getMemberByProp(key, value) {
        const data = await this.getByAny({
            propName: key,
            propValue: value
        });

        return data;
    }
}

module.exports = new MemberDataAccess();
