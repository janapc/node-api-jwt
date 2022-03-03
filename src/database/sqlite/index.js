const sqlite3 = require("sqlite3").verbose();

const usersSchema = require("./usersSchema");
const postsSchema = require("./postsSchema");

const db = new sqlite3.Database("db.sqlite");

db.serialize(() => {
  db.run('PRAGMA foreign_keys=ON')
  db.run(postsSchema);
  db.run(usersSchema);
});

process.on("SIGINT", () =>
  db.close(() => {
    process.exit(0);
  })
);

module.exports = db;
