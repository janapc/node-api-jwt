const passport = require("passport");

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
      next();
    })(req, res, next);
  },
  bearer: (req, res, next) => {
    passport.authenticate("bearer", { session: false }, (error, user, info) => {
      if (error && error.name)
        return res.status(401).json(typeErrors[error.name || ""](error));

      if (error)
        return res.status(error.code || 500).json({ error: error.message });

      if (!user) return res.status(401).end();

      req.user = user;
      req.token = info.token;
      
      next();
    })(req, res, next);
  },
};
