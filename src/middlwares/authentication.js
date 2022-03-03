const passport = require("passport");
const UsersModel = require("../models/UsersModel");

const Users = require("../models/UsersModel");
const handleToken = require("../utils/handleToken");

const typeErrors = {
  JsonWebTokenError: (error) => ({ error: error.message }),
  TokenExpiredError: (error) => ({
    error: error.message,
    expiredAt: error.expiredAt,
  }),
};

module.exports = {
  local: (req, res, next) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error)
        return res.status(error.code || 500).json({ error: error.message });

      if (!user) return res.status(401).end();

      req.user = user;
      req.hasAuthentication = true;

      next();
    })(req, res, next);
  },
  bearer: (req, res, next) => {
    passport.authenticate("bearer", { session: false }, (error, user, info) => {
      if (error && error.name && typeErrors.hasOwnProperty(error.name))
        return res.status(401).json(typeErrors[error.name](error));

      if (error)
        return res.status(error.code || 500).json({ error: error.message });

      if (!user) return res.status(401).end();

      req.user = user;
      req.token = info.token;
      req.hasAuthentication = true;

      next();
    })(req, res, next);
  },
  refresh: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const id = await handleToken.refresh.verify(refreshToken);

      await handleToken.refresh.invalid(refreshToken);
      req.user = await Users.findById(id);

      return next();
    } catch (error) {
      return res.status(error.code || 500).json({ error: error.message });
    }
  },
  verifyEmail: async (req, res, next) => {
    try {
      const { token } = req.params;

      const id = await handleToken.verifyEmail.verify(token);
      const user = await UsersModel.findById(id);

      req.user = user;
      next();
    } catch (error) {
      if (error && error.name && typeErrors.hasOwnProperty(error.name)) {
        return res.status(401).json(typeErrors[error.name](error));
      }
      return res.status(error.code || 500).json({ error: error.message });
    }
  },
};
