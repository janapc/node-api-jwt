const UsersController = require("../controllers/UsersController");
const authMiddlewares = require("../utils/authMiddlewares");

module.exports = (app) => {
  app.route("/users").get(UsersController.list);
  app.route("/users").post(UsersController.add);
  app
    .route("/users/:id")
    .delete(authMiddlewares.bearer, UsersController.remove);

  app.route("/users/login").post(authMiddlewares.local, UsersController.login);
  app
    .route("/users/logout")
    .get(authMiddlewares.bearer, UsersController.logout);
};
