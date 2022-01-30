const UsersController = require("../controllers/UsersController");
const authMiddlewares = require("../utils/authMiddlewares");

module.exports = (app) => {
  app
    .route("/users/update_token")
    .post(authMiddlewares.refresh, UsersController.login);
  app.route("/users").get(UsersController.list);
  app.route("/users").post(UsersController.add);
  app
    .route("/users/verify_email/:token")
    .get(authMiddlewares.verifyEmail, UsersController.verifyEmail);
  app
    .route("/users/:id")
    .delete(authMiddlewares.bearer, UsersController.remove);

  app.route("/users/login").post(authMiddlewares.local, UsersController.login);
  app
    .route("/users/logout")
    .post(
      [authMiddlewares.refresh, authMiddlewares.bearer],
      UsersController.logout
    );
};
