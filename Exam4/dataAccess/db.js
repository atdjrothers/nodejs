const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const path = require('path');
const dbAsync = lowdb(new FileAsync(path.join(__dirname, 'db.json')));

class DataAccess {
    constructor(tableName) {
        this.tableName = tableName;
        this.dbContext = dbAsync.then(db => {
            db.defaults({ [tableName]: [] }).write();
            return db;
        });
    }

    async getAll() {
        const dbContext = await this.dbContext;
        return dbContext.get(this.tableName).value();
    }

    async getByAny({ propName, propValue }) {
        const dbContext = await this.dbContext;

        return dbContext
            .get(this.tableName)
            .find({ [propName]: propValue })
            .value();
    }

    async insert(data) {
        const dbContext = await this.dbContext;
        dbContext.get(this.tableName)
            .push({
                ...data
            })
            .write();

        const user = await this.getByAny({
            propName: 'username',
            propValue: data.username
        });

        return user;
    }

    async update(username, data) {
        const dbContext = await this.dbContext;

        dbContext.get(this.tableName)
            .find({ username })
            .assign(data)
            .write();
    }

    async delete(username) {
        const dbContext = await this.dbContext;

        dbContext
            .get(this.tableName)
            .remove({ username })
            .write();
    }
}

module.exports = DataAccess;
