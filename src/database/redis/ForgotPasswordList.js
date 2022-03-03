const db = require("./index");
const HandleRedis = require("./HandleRedis");

const PREFIX = "forgot-password-list:";

class ForgotPasswordList extends HandleRedis {
  constructor() {
    super(db);
  }

  async set(token, id, dateExp) {
    await this.setkey(`${PREFIX}${token}`, id, dateExp);
  }

  async get(token) {
    return await this.getKey(`${PREFIX}${token}`);
  }
}

module.exports = ForgotPasswordList;
