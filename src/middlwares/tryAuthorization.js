const authorization = require("./authorization");

module.exports = (entitie, action) => (req, res, next) => {
  if (req.hasAuthentication === true) {
    return authorization(entitie, action)(req, res, next);
  }

  next();
};
