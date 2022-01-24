const PostsController = require("../controllers/PostsController");
const authMiddlewares = require("../utils/authMiddlewares");

module.exports = (app) => {
  app.route("/posts").get(PostsController.list);
  app.route("/posts").post(authMiddlewares.bearer, PostsController.add);
};
