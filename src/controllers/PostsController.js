const PostsModel = require("../models/PostsModel");

class PostsController {
  async list(req, res) {
    try {
      const posts = await PostsModel.list();
      return res.json(posts);
    } catch (error) {
      res.status(error.code).json({ error: error.message });
    }
  }

  async add(req, res) {
    try {
      const post = await PostsModel.add(req.body);
      return res.status(201).json(post);
    } catch (error) {
      res.status(error.code).json({ error: error.message });
    }
  }
}
module.exports = new PostsController();
