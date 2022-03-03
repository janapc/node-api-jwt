const db = require("../database/sqlite");
const HandlerErrors = require("../utils/handlerErrors");

class PostsRepositories {
  async add(post) {
    const query = `INSERT INTO posts (title, content, authorId) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) => {
      db.run(
        query,
        [post.title, post.content, post.authorId],
        function (error) {
          if (error) return reject(new HandlerErrors(500, "Error internal"));
          return resolve(this.lastID);
        }
      );
    });
  }

  async getById(id) {
    const query = `SELECT * FROM posts WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.get(query, [id], (error, row) => {
        if (error) return reject(new HandlerErrors(500, "Error internal"));

        return resolve(row);
      });
    });
  }

  async getByAuthorId(id, authorId) {
    const query = `SELECT * FROM posts WHERE id = ? AND authorId = ?`;
    return new Promise((resolve, reject) => {
      db.get(query, [id, authorId], (error, row) => {
        if (error) return reject(new HandlerErrors(500, "Error internal"));

        return resolve(row);
      });
    });
  }

  async remove(id, authorId) {
    const query = `DELETE FROM posts WHERE id = ? AND authorId = ?`;
    return new Promise((resolve, reject) => {
      db.run(query, [id, authorId], (error) => {
        if (error) return reject(new HandlerErrors(500, "Error internal"));

        return resolve();
      });
    });
  }

  async list() {
    const query = `SELECT id, title, content, authorId FROM posts`;
    return new Promise((resolve, reject) => {
      db.all(query, (error, row) => {
        if (error) return reject(new HandlerErrors(500, "Error internal"));

        return resolve(row);
      });
    });
  }
}

module.exports = new PostsRepositories();
