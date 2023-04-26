const express = require("express");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const Sequelize = require("sequelize");
require("dotenv").config();

const app = express();
const port = 1516;

routes(app);

app.use(cookieParser());

app.listen(port, () => {
  console.log("servidor online");
});

module.exports = app;
