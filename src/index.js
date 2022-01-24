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

const routes = require("./routers/routes");
routes(app);

app.listen(port, () => console.log(`App listening on port ${port}`));
