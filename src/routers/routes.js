const postsRouter = require("./postsRouter");
const usersRouter = require("./usersRouter");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  
  usersRouter(app);
  postsRouter(app);
};
