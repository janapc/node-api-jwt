const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const LocalStrategy = require("passport-local").Strategy;
const bearerStrategy = require("passport-http-bearer").Strategy;

const UsersModel = require("../models/UsersModel");
const HandlerErrors = require("../utils/handlerErrors");
const db = require("../database/redis/handleBlacklist");

async function verifyPassword(password, passwordHash) {
  const passwordValid = await bcrypt.compare(password, passwordHash);
  if (!passwordValid)
    throw new HandlerErrors(400, "This password or e-mail is invalid");
}

async function verifyTokenBlacklist(token) {
  const tokenBlacklist = await db.get(token);
  if (tokenBlacklist) throw new jwt.JsonWebTokenError("Token invalid");
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
      await verifyTokenBlacklist(token);
      const payload = jwt.verify(token, process.env.SECRET_JWT);
      const user = await UsersModel.findById(payload.id);

      done(null, user, { token });
    } catch (error) {
      done(error);
    }
  })
);
