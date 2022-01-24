const redis = require("redis");

const client = redis.createClient();

(async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
})();

module.exports = client;
