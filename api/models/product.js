"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
      });
      Product.belongsToMany(models.Cart, {
        through: models.CartItem,
      });
      Product.belongsToMany(models.Order, {
        through: models.OrderItem,
      });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      price: DataTypes.INTEGER,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      size: DataTypes.STRING,
      stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
