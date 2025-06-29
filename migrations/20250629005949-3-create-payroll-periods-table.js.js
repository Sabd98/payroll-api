"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("payroll_periods", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      is_processed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

    await queryInterface.addConstraint("payroll_periods", {
      fields: ["start_date", "end_date"],
      type: "check",
      name: "end_date_after_start_date",
      where: {
        [Sequelize.Op.and]: [Sequelize.literal("end_date > start_date")],
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("payroll_periods");
  },
};
