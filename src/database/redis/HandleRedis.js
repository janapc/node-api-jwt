class HandleRedis {
  constructor(db) {
    this.db = db;
  }

  async setkey(key, value, dateExp) {
    await this.db.set(key, value, {
      EX: dateExp,
    });
  }

  async existsKey(key) {
    const result = await this.db.exists(key);

    return result === 1;
  }

  async getKey(key) {
    const result = await this.db.get(key);
    return result;
  }

  async deleteKey(key) {
    await this.db.del(key);
  }
}

module.exports = HandleRedis;
