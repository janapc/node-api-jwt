const db = require("../database/sqlite");
const HandlerErrors = require("../utils/handlerErrors");

class UserRepository {
  async list() {
    const query = `SELECT * FROM users`;
    return new Promise((resolve, reject) => {
      db.all(query, (error, row) => {
        if (error)
          return reject(
            new HandlerErrors(
              500,
              "There was a problem performing the operation. Try later"
            )
          );
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
        (error, usuario) => {
          if (error) {
            return reject(
              new HandlerErrors(
                500,
                "There was a problem performing the operation. Try later"
              )
            );
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
        (error, usuario) => {
          if (error) {
            return reject(
              new HandlerErrors(
                500,
                "There was a problem performing the operation. Try later"
              )
            );
          }

          return resolve(usuario);
        }
      );
    });
  }

  async add(user) {
    const query = `INSERT INTO users (name, email, passwordHash, emailChecked, role) VALUES (?, ?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
      db.run(
        query,
        [
          user.name,
          user.email,
          user.passwordHash,
          user.emailChecked,
          user.role,
        ],
        (error) => {
          if (error)
            return reject(
              new HandlerErrors(
                500,
                "There was a problem performing the operation. Try later"
              )
            );

          return resolve();
        }
      );
    });
  }

  async remove(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.run(query, [id], (error) => {
        if (error)
          return reject(
            new HandlerErrors(
              500,
              "There was a problem performing the operation. Try later"
            )
          );
        return resolve();
      });
    });
  }

  async updateFieldEmailChecked(id, emailChecked) {
    const query = `UPDATE users SET emailChecked = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.run(query, [emailChecked, id], (error) => {
        if (error)
          return reject(
            new HandlerErrors(
              500,
              "There was a problem performing the operation. Try later"
            )
          );
        return resolve();
      });
    });
  }

  async updatePassword(password, id) {
    const query = `UPDATE users SET passwordHash = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.run(query, [password, id], (error) => {
        if (error)
          return reject(
            new HandlerErrors(
              500,
              "There was a problem performing the operation. Try later"
            )
          );
        return resolve();
      });
    });
  }
}

module.exports = new UserRepository();
