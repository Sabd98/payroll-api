"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("overtimes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      hours: {
        type: Sequelize.DECIMAL(4, 1),
        allowNull: false,
        validate: {
          min: 0.1,
          max: 3.0,
        },
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
          model: "employees",
          key: "id",
        },
      },
      updated_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "employees",
          key: "id",
        },
      },
      ip_address: {
        type: Sequelize.INET,
      },
    });

    await queryInterface.addIndex("overtimes", {
      fields: ["employee_id", "date"],
      unique: true,
      name: "unique_overtime_per_employee_per_date",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("overtimes");
  },
};
