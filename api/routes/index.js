const bodyParser = require("body-parser");
const users = require("./userRoutes");
const categorys = require("./categorysRoutes");
const products = require("./productsRoutes");
const address = require("./addressRoutes");
const cart = require("./cartRoutes");
const orders = require("./orderRoutes");

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(users);
  app.use(categorys);
  app.use(products);
  app.use(address);
  app.use(cart);
  app.use(orders);
};
