const db = require("./index");
const HandleRedis = require("./HandleRedis");

const PREFIX = "allowlist-refresh-token:";

class Allowlist extends HandleRedis {
  constructor() {
    super(db);
  }

  async set(token, id, dateExp) {
    await this.setkey(`${PREFIX}${token}`, id, dateExp);
  }

  async get(token) {
    return await this.getKey(`${PREFIX}${token}`);
  }

  async delete(token) {
    await this.deleteKey(`${PREFIX}${token}`);
  }
}

module.exports = Allowlist;
