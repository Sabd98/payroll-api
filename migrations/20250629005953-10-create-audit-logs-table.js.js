"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("reimbursements", "payslip_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "payslips",
        key: "id",
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("reimbursements", "payslip_id");
  },
};
