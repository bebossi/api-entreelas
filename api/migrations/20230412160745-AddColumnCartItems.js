"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("CartItems", "CartId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Carts",
        key: "id",
      },
    });
    await queryInterface.addColumn("CartItems", "ProductId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("CartItems", "CartId");
    await queryInterface.removeColumn("CartItems", "ProductId");
  },
};
