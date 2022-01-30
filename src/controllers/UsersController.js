const UserModel = require("../models/UsersModel");
const handleToken = require("../utils/handleToken");
const VerifyEmail = require("../services/email/VerifyEmail");

const generateAddress = (router, token) =>
  `${process.env.BASE_URL}${router}${token}`;

class UserController {
  async list(req, res) {
    try {
      const users = await UserModel.list();
      return res.json(users);
    } catch (error) {
      res.status(error.code).json({ error: error.message });
    }
  }

  async add(req, res) {
    try {
      const user = req.body;

      const newUser = await UserModel.add(user);

      const token = handleToken.verifyEmail.create(newUser.id, [1, "h"]);
      const address = generateAddress("/users/verify_email/", token);
      const verifyEmail = new VerifyEmail(newUser, address);
      verifyEmail.sendMail().catch(console.log);

      return res.status(201).end();
    } catch (error) {
      return res.status(error.code).json({ error: error.message });
    }
  }

  async remove(req, res) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User is not found" });
      }

      await UserModel.remove(req.params.id);
      return res.status(204).end();
    } catch (error) {
      return res.status(error.code).json({ error: error.message });
    }
  }

  async login(req, res) {
    const accessToken = handleToken.access.create(req.user.id, [15, "m"]);
    const refreshToken = await handleToken.refresh.create(req.user.id, [
      5,
      "d",
    ]);

    res.set("Authorization", accessToken);

    return res.status(200).json({ refreshToken });
  }

  async logout(req, res) {
    try {
      const token = req.token;

      await handleToken.access.invalid(token);

      return res.status(204).end();
    } catch (error) {
      return res.status(error.code).json({ error: error.message });
    }
  }

  async verifyEmail(req, res) {
    try {
      await UserModel.verifyEmail(req.user.id);

      return res.status(204).end();
    } catch (error) {
      return res.status(error.code).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
