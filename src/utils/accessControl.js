const AccessControl = require("accesscontrol");
const control = new AccessControl();

control
  .grant("subscriber")
  .readAny("posts", ["id", "title", "content", "authorId"])
  .readAny("users", ["name"]);

control
  .grant("publisher")
  .extend("subscriber")
  .createOwn("posts")
  .deleteOwn("posts");

control
  .grant("admin")
  .createAny("posts")
  .deleteAny("posts")
  .readAny("posts")
  .deleteAny("posts")
  .readAny("users")
  .deleteAny("users");

module.exports = control;
