const accessControl = require("../utils/accessControl");

const methods = {
  read: {
    all: "readAny",
    own: "readOwn",
  },
  create: {
    all: "createAny",
    own: "createOwn",
  },
  delete: {
    all: "deleteAny",
    own: "deleteOwn",
  },
};

module.exports = (entitie, action) => (req, res, next) => {
  const allowByRole = accessControl.can(req.user.role);
  const actions = methods[action];

  const allowAll = allowByRole[actions.all](entitie);
  const allowOwn = allowByRole[actions.own](entitie);

  if (allowAll.granted === false && allowOwn.granted === false) {
    return res.status(403).end();
  }

  req.access = {
    all: { allow: allowAll.granted, attributes: allowAll.attributes },
    own: { allow: allowOwn.granted, attributes: allowOwn.attributes },
    attributes: allowAll.attributes || allowOwn.attributes,
  };
  next();
};
