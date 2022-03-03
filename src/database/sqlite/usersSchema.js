const usersSchema = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(40) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    emailChecked INTEGER,
    role VARCHAR(15) CHECK(role in ('admin','publisher','subscriber')) NOT NULL
  )
  `;

 module.exports = usersSchema;