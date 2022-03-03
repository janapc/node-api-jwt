const bodyParser = require("body-parser");
const express = require("express");

require("dotenv").config();

require("./database/sqlite");
require("./database/redis");
require("./validation/strategicAuthUser");

const app = express();
const port = 3000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.use((req, res, next) => {
  const accept = req.get("Accept");
  const typesAvailable = ["application/json", "*/*"];

  if (!accept || !typesAvailable.includes(accept)) {
    return res.status(406).end();
  }

  res.set({
    "Content-Type": "application/json",
  });

  next();
});

const routes = require("./routers/routes");
routes(app);

app.listen(port, () => console.log(`App listening on port ${port}`));
