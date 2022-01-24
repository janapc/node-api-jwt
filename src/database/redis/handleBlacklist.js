const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const db = require("./index");

function generateTokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {
  add: async (token) => {
    const dateExp = jwt.decode(token).exp;
    const tokenHash = generateTokenHash(token);

    await db.set(tokenHash, "", {
      EX: dateExp,
    });
  },
  get: async (token) => {
    const tokenHash = generateTokenHash(token);

    const result = await db.exists(tokenHash);

    return result === 1;
  },
};
