"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("OrderItems", "OrderId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id",
      },
    });
    await queryInterface.addColumn("OrderItems", "ProductId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("OrderItems", "OrderId");
    await queryInterface.removeColumn("OrderItems", "ProductId");
  },
};
