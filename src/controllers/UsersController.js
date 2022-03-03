const UsersModel = require("../models/UsersModel");
const handleToken = require("../utils/handleToken");
const VerifyEmail = require("../services/email/VerifyEmail");
const ForgotPassword = require("../services/email/ForgotPassword");
const HandlerErrors = require("../utils/handlerErrors");

/**
 * @name generateAddress
 * @description generate address
 */
const generateAddress = (router, token) =>
  `${process.env.BASE_URL}${router}${token}`;

/**
 * @description All users manipulation operations
 */
class UsersController {
  /**
   * @name list
   * @description get all users
   * @param {Request} req
   * @param {Response} res
   * @returns all users
   */
  async list(req, res) {
    try {
      let result = await UsersModel.list();
      if (!req.hasAuthentication) {
        result = result.map((user) => ({
          name: user.name,
        }));
      } else if (req.access.attributes) {
        if (!req.access.attributes.includes("*")) {
          result = result.map((user) => ({
            name: user.name,
          }));
        }
      }

      return res.json(result);
    } catch (error) {
      res.status(error.code || 500).json({ error: error.message });
    }
  }

  /**
   * @name add
   * @description create a new user
   * @param {Request} req
   * @param {Response} res
   * @returns status 201
   */
  async add(req, res) {
    try {
      const user = req.body;

      const newUser = await UsersModel.add(user);

      const token = handleToken.verifyEmail.create(newUser.id, [1, "h"]);
      const address = generateAddress("/users/verify_email/", token);
      const verifyEmail = new VerifyEmail(newUser, address);
      verifyEmail.sendMail().catch(console.log);

      return res.status(201).end();
    } catch (error) {
      return res.status(error.code || 500).json({ error: error.message });
    }
  }

  /**
   * @name remove
   * @description remove an user
   * @param {Request} req
   * @param {Response} res
   * @returns status 204
   */
  async remove(req, res) {
    try {
      await UsersModel.findById(req.params.id);

      await UsersModel.remove(req.params.id);
      return res.status(204).end();
    } catch (error) {
      return res.status(error.code || 500).json({ error: error.message });
    }
  }

  /**
   * @name login
   * @description login user
   * @param {Request} req
   * @param {Response} res
   * @returns refresh token
   */
  async login(req, res) {
    try {
      const accessToken = handleToken.access.create(req.user.id, [30, "m"]);
      const refreshToken = await handleToken.refresh.create(req.user.id, [
        5,
        "d",
      ]);

      res.set("Authorization", accessToken);

      return res.status(200).json({ refreshToken });
    } catch (error) {
      return res.status(error.code || 500).json({ error: error.message });
    }
  }

  /**
   * @name logout
   * @description logout user
   * @param {Request} req
   * @param {Response} res
   * @returns status 204
   */
  async logout(req, res) {
    try {
      const token = req.token;

      await handleToken.access.invalid(token);

      return res.status(204).end();
    } catch (error) {
      return res.status(error.code || 500).json({ error: error.message });
    }
  }

  /**
   * @name verifyEmail
   * @description verify email of user
   * @param {Request} req
   * @param {Response} res
   * @returns status 204
   */
  async verifyEmail(req, res) {
    try {
      await UsersModel.verifyEmail(req.user.id);

      return res.status(204).end();
    } catch (error) {
      return res.status(error.code || 500).json({ error: error.message });
    }
  }

  async forgotPassword(req, res) {
    const messageDefault =
      "if we find a user with this email, we send a message with instructions to redefine your password";
    try {
      const user = await UsersModel.findByEmail(req.body.email);
      const token = await handleToken.forgotPassword.create(user.id, [1, "h"]);

      const forgotPassword = new ForgotPassword(user, token);
      await forgotPassword.sendMail();

      res.json({ message: messageDefault });
    } catch (error) {
      if (error.message === "User is not found") {
        return res.json({ message: messageDefault });
      }
      return res.status(error.code || 500).json({ error: error.message });
    }
  }

  async redefinePassword(req, res) {
    try {
      if (
        typeof req.body.forgotPassword !== "string" ||
        req.body.forgotPassword.lenght === 0
      ) {
        throw new HandlerErrors(400, "forgotPassword invalid");
      }

      const id = await handleToken.forgotPassword.verify(
        req.body.forgotPassword
      );
      await UsersModel.findById(id);

      const passwordHash = await UsersModel.genaratePasswordHash(
        req.body.password
      );

      await UsersModel.updatePassword(passwordHash, id);

      return res.json({ message: "Your password has updated with success" });
    } catch (error) {
      return res.status(error.code || 500).json({ error: error.message });
    }
  }
}

module.exports = new UsersController();
