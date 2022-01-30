const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const moment = require("moment");

const HandlerErrors = require("../utils/handlerErrors");
const Allowlist = require("../database/redis/Allowlist");
const BlockList = require("../database/redis/Blocklist");

module.exports = {
  access: {
    blocklist: new BlockList(),
    create(id, [time, day]) {
      return jwt.sign({ id }, process.env.SECRET_JWT, {
        expiresIn: time + day,
      });
    },
    async verify(token) {
      const getToken = await this.blocklist.exists(token);
      if (getToken) throw new jwt.JsonWebTokenError("Token invalid");

      const payload = jwt.verify(token, process.env.SECRET_JWT);

      return payload.id;
    },
    async invalid(token) {
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      const dateExp = jwt.decode(token).exp;
      await this.blocklist.set(tokenHash, dateExp);
    },
  },
  refresh: {
    allowlist: new Allowlist(),
    name: "refreshToken",
    async create(id, [time, day]) {
      const tokenHash = crypto.randomBytes(24).toString("hex");
      const dateExp = moment().add(time, day).unix();

      await this.allowlist.set(tokenHash, id, dateExp);

      return tokenHash;
    },
    async verify(token) {
      if (!token)
        throw new HandlerErrors(400, `The field ${this.name} is mandatory`);

      const id = await this.allowlist.get(token);
      if (!id)
        throw new HandlerErrors(400, `The field ${this.name} is invalid`);

      return id;
    },
    async invalid(token) {
      await this.allowlist.delete(token);
    }
  },
  verifyEmail: {
    create(id, [time, day]) {
      return jwt.sign({ id }, process.env.SECRET_JWT, {
        expiresIn: time + day,
      });
    },
    async verify(token) {
      const payload = jwt.verify(token, process.env.SECRET_JWT);

      return payload.id;
    },
  }
};
