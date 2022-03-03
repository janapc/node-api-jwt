const postsSchema = `
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(50) NOT NULL,
    content VARCHAR(140),
    authorId INTEGER NOT NULL,
    FOREIGN KEY (authorId) REFERENCES users(id)
  )
  `;

module.exports = postsSchema;
