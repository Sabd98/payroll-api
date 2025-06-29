"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("employees", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      monthly_salary: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
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
        allowNull: true, // FK akan ditambahkan nanti
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.INET,
      },
    });

    await queryInterface.addIndex("employees", ["username"], {
      name: "employees_username_unique",
      unique: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("employees");
  },
};
