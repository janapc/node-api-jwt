const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const db = require("./index");
const HandleRedis = require("./HandleRedis");

const PREFIX = "blocklist-access-token:";

class Blocklist extends HandleRedis {
  constructor() {
    super(db);
  }

  async set(token, dateExp) {
    await this.setkey(`${PREFIX}${token}`, "", dateExp);
  }

  async exists(token) {
    return await this.existsKey(`${PREFIX}${token}`);
  }
}

module.exports = Blocklist;
