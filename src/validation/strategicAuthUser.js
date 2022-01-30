const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const bearerStrategy = require("passport-http-bearer").Strategy;

const UsersModel = require("../models/UsersModel");
const HandlerErrors = require("../utils/handlerErrors");
const handleToken = require("../utils/handleToken");

async function verifyPassword(password, passwordHash) {
  const passwordValid = await bcrypt.compare(password, passwordHash);
  if (!passwordValid)
    throw new HandlerErrors(400, "This password or e-mail is invalid");
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await UsersModel.findByEmail(email);
        if (!user) throw new HandlerErrors(400, "Email is not exists");

        await verifyPassword(password, user.passwordHash);

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new bearerStrategy(async (token, done) => {
    try {
      const id = await handleToken.access.verify(token);
      const user = await UsersModel.findById(id);

      done(null, user, { token });
    } catch (error) {
      done(error);
    }
  })
);
