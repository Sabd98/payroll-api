"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("audit_logs", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      action: {
        type: Sequelize.ENUM("CREATE", "UPDATE", "DELETE"),
        allowNull: false,
      },
      table_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      record_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_type: {
        type: Sequelize.ENUM("admin", "employee"),
        allowNull: false,
      },
      ip_address: {
        type: Sequelize.INET,
        allowNull: false,
      },
      request_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      old_data: {
        type: Sequelize.JSONB,
      },
      new_data: {
        type: Sequelize.JSONB,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("audit_logs", ["table_name", "record_id"], {
      name: "idx_audit_logs_table_record",
    });

    await queryInterface.addIndex("audit_logs", ["created_at"], {
      name: "idx_audit_logs_created_at",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("audit_logs");
  },
};
