const UsersController = require("../controllers/UsersController");

const middlewaresAuthentication = require("../middlwares/authentication");
const middlewaresAuthorization = require("../middlwares/authorization");
const middlewaresTryAuthentication = require("../middlwares/tryAuthentication");
const middlewaresTryAuthorization = require("../middlwares/tryAuthorization");

module.exports = (app) => {
  app
    .route("/users/update_token")
    .post(middlewaresAuthentication.refresh, UsersController.login);

  app
    .route("/users")
    .get(
      [
        middlewaresTryAuthentication,
        middlewaresTryAuthorization("users", "read"),
      ],
      UsersController.list
    )
    .post(UsersController.add);

  app
    .route("/users/verify_email/:token")
    .get(middlewaresAuthentication.verifyEmail, UsersController.verifyEmail);

  app
    .route("/users/:id")
    .delete(
      [
        middlewaresAuthentication.bearer,
        middlewaresAuthentication.local,
        middlewaresAuthorization("users", "delete"),
      ],
      UsersController.remove
    );

  app
    .route("/users/login")
    .post(middlewaresAuthentication.local, UsersController.login);

  app
    .route("/users/logout")
    .post(
      [middlewaresAuthentication.refresh, middlewaresAuthentication.bearer],
      UsersController.logout
    );

  app.route("/users/forgot_password").post(UsersController.forgotPassword);
  app.route("/users/redefine_password").post(UsersController.redefinePassword);
};
