const PostsModel = require("../models/PostsModel");
const NewPost = require("../services/email/NewPost");

/**
 * @name PostsController
 * @description All post manipulation operations
 */
class PostsController {
  /**
   * @name add
   * @description create a new post
   * @param {Request} req
   * @param {Response} res
   * @returns status 201
   */
  async add(req, res) {
    try {
      const postId = await PostsModel.add({
        ...req.body,
        authorId: req.user.id,
      });
      const newPost = new NewPost(req.user, postId, req.body.title);
      await newPost.sendMail();

      return res.status(201).end();
    } catch (error) {
      res.status(error.code || 500).json({
        error:
          error.message ||
          "There was a problem performing the operation. Try later",
      });
    }
  }

  /**
   * @name getById
   * @description get a post by id
   * @param {Request} req
   * @param {Response} res
   * @returns the post
   */
  async getById(req, res) {
    try {
      const result = await PostsModel.getById(req.params.id, req.user.id);
      return res.json(result);
    } catch (error) {
      return res.status(error.code || 500).json({
        error:
          error.message ||
          "There was a problem performing the operation. Try later",
      });
    }
  }

  /**
   * @name remove
   * @description remove a post
   * @param {Request} req
   * @param {Response} res
   * @returns status 204
   */
  async remove(req, res) {
    try {
      let post;
      if (req.access.all.allow === true) {
        post = await PostsModel.getById(req.params.id);
      } else if (req.access.own.allow === true) {
        post = await PostsModel.getByAuthorId(req.params.id, req.user.id);
      }

      await PostsModel.remove(post.id, post.authorId);
      return res.status(204).end();
    } catch (error) {
      return res.status(error.code || 500).json({
        error:
          error.message ||
          "There was a problem performing the operation. Try later",
      });
    }
  }

  /**
   * @name list
   * @description get all posts
   * @param {Request} req
   * @param {Response} res
   * @returns all posts
   */
  async list(req, res) {
    try {
      let result = await PostsModel.list();

      if (!req.hasAuthentication)
        result = result.map((post) => ({
          title: post.title,
          content: post.content.substring(0, 10) + "...",
        }));

      return res.json(result);
    } catch (error) {
      return res.status(error.code || 500).json({
        error:
          error.message ||
          "There was a problem performing the operation. Try later",
      });
    }
  }
}
module.exports = new PostsController();
