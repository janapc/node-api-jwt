const db = require("../database/sqlite");
const HandlerErrors = require("../utils/handlerErrors");

class PostsRepositories {
  async list() {
    const query = `SELECT * FROM posts`;
    return new Promise((resolve, reject) => {
      db.all(query, (error, row) => {
        if (error) return reject(HandlerErrors(500, "Error in list the posts"));
        return resolve(row);
      });
    });
  }

  async add(post) {
    const query = `INSERT INTO posts (title, content) VALUES (?, ?)`;
    return new Promise((resolve, reject) => {
      db.run(query, [post.title, post.content], (erro) => {
        if (erro) return reject(HandlerErrors(500, "Error in create the post"));

        return resolve();
      });
    });
  }
}

module.exports = new PostsRepositories();
