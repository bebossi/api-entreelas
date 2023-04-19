"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Address.init(
    {
      street: DataTypes.STRING,
      neighborhood: DataTypes.STRING,
      CEP: DataTypes.INTEGER,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      streetNumber: DataTypes.INTEGER,
      apartmentNumber: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Address",
    }
  );
  return Address;
};
