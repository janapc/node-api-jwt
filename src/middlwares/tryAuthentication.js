const middlewaresAuthentication = require("./authentication");

module.exports = (req, res, next) => {
  req.hasAuthentication = false;

  if (req.get("Authorization")) {
    return middlewaresAuthentication.bearer(req, res, next);
  }

  next();
};
