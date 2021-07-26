const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const path = require('path');
const dbAsync = lowdb(new FileAsync(path.join(__dirname, 'db.json')));
const { v4: uuid } = require('uuid');

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

    async getById(id) {
        const dbContext = await this.dbContext;

        return dbContext
            .get(this.tableName)
            .find({ id })
            .value();
    }

    async getByAny({ propName, propValue }) {
        const dbContext = await this.dbContext;

        return dbContext
            .get(this.tableName)
            .find({ [propName]: propValue })
            .value();
    }

    async getAllByProp({ propName, propValue }) {
        const dbContext = await this.dbContext;

        return dbContext
            .get(this.tableName)
            .filter(c => c[propName] === propValue)
            .value();
    }

    async insert(data) {
        const dbContext = await this.dbContext;
        const id = uuid();

        dbContext.get(this.tableName)
            .push({
                id,
                ...data
            })
            .write();

        return this.getById(id);
    }

    async update(data) {
        const dbContext = await this.dbContext;
        const id = data.id;
        dbContext.get(this.tableName)
            .find({ id })
            .assign(data)
            .write();
    }

    async delete(id) {
        const dbContext = await this.dbContext;
        dbContext
            .get(this.tableName)
            .remove({ id })
            .write();
    }
}

module.exports = DataAccess;
