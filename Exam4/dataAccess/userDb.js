const DataAccess = require('./db');

class UserDataAccess extends DataAccess {
  constructor () {
    super('users');
  }

  async getUserByUsername (username) {
    const user = await this.getByAny({
      propName: 'username',
      propValue: username
    });

    return user;
  }

  async getUserByEmailAddress (emailAddress) {
    const user = await this.getByAny({
      propName: 'emailAddress',
      propValue: emailAddress
    });

    return user;
  }
}

module.exports = new UserDataAccess();
