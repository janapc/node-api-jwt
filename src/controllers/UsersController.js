const jwt = require("jsonwebtoken");

const UserModel = require("../models/UsersModel");
const blacklist = require("../database/redis/handleBlacklist");

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
      await UserModel.add(req.body);
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
    const token = jwt.sign({ id: req.user.id }, process.env.SECRET_JWT, {
      expiresIn: "15m",
    });
    res.set("Authorization", token);

    return res.status(204).end();
  }

  async logout(req, res) {
    try {
      const token = req.token;
      await blacklist.add(token);
      return res.status(204).end();
    } catch (error) {
      return res.status(error.code).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
