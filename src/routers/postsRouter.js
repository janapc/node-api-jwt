const PostsController = require("../controllers/PostsController");
const middlewaresAuthentication = require("../middlwares/authentication");
const middlewaresAuthorization = require("../middlwares/authorization");
const middlewaresTryAuthentication = require("../middlwares/tryAuthentication");
const middlewaresTryAuthorization = require("../middlwares/tryAuthorization");

module.exports = (app) => {
  app
    .route("/posts")
    .get(
      [
        middlewaresTryAuthentication,
        middlewaresTryAuthorization("posts", "read"),
      ],
      PostsController.list
    )
    .post(
      [
        middlewaresAuthentication.bearer,
        middlewaresAuthorization("posts", "create"),
      ],
      PostsController.add
    );

  app
    .route("/posts/:id")
    .get(
      [
        middlewaresAuthentication.bearer,
        middlewaresAuthorization("posts", "read"),
      ],
      PostsController.getById
    )
    .delete(
      [
        middlewaresAuthentication.bearer,
        middlewaresAuthentication.local,
        middlewaresAuthorization("posts", "delete"),
      ],
      PostsController.remove
    );
};
