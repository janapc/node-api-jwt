const db = require("../database/sqlite");
const HandlerErrors = require("../utils/handlerErrors");

class UserRepository {
  async list() {
    const query = `SELECT * FROM users`;
    return new Promise((resolve, reject) => {
      db.all(query, (error, row) => {
        if (error) return reject(HandlerErrors(500, "Error in list the users"));
        return resolve(row);
      });
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `
          SELECT *
          FROM users
          WHERE id = ?
        `,
        [id],
        (erro, usuario) => {
          if (erro) {
            return reject(HandlerErrors(500, "User not found"));
          }

          return resolve(usuario);
        }
      );
    });
  }

  async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(
        `
          SELECT *
          FROM users
          WHERE email = ?
        `,
        [email],
        (erro, usuario) => {
          if (erro) {
            return reject(HandlerErrors(500, "User not found"));
          }

          return resolve(usuario);
        }
      );
    });
  }

  async add(user) {
    const query = `INSERT INTO users (name,email, passwordHash) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) => {
      db.run(query, [user.name, user.email, user.passwordHash], (erro) => {
        if (erro) return reject(HandlerErrors(500, "Error in create the user"));

        return resolve();
      });
    });
  }

  async remove(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.run(query, [id], (erro) => {
        if (erro)
          return reject(HandlerErrors(500, "Error in remover the user"));
        return resolve();
      });
    });
  }
}

module.exports = new UserRepository();
