"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("payslips", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      base_salary: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      overtime_pay: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      total_reimbursements: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      total_pay: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "employees",
          key: "id",
        },
      },
      payroll_period_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "payroll_periods",
          key: "id",
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "admins",
          key: "id",
        },
      },
      updated_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "admins",
          key: "id",
        },
      },
      ip_address: {
        type: Sequelize.INET,
      },
    });

    await queryInterface.addIndex("payslips", {
      fields: ["employee_id", "payroll_period_id"],
      unique: true,
      name: "unique_payslip_per_employee_per_period",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("payslips");
  },
};
