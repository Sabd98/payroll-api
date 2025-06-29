"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("attendances", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: Sequelize.DATEONLY,
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

    await queryInterface.addConstraint("attendances", {
      fields: ["date"],
      type: "check",
      name: "no_weekend_attendance",
      where: {
        [Sequelize.Op.and]: [
          Sequelize.literal("EXTRACT(DOW FROM date) NOT IN (0,6)"),
        ],
      },
    });

    await queryInterface.addIndex("attendances", {
      fields: ["employee_id", "date"],
      unique: true,
      name: "unique_attendance_per_employee_per_date",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("attendances");
  },
};
