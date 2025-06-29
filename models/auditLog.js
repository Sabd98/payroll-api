// models/auditLog.js
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define(
    "AuditLog",
    {
      action: {
        type: DataTypes.ENUM("CREATE", "UPDATE", "DELETE"),
        allowNull: false,
      },
      table_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      record_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_type: {
        type: DataTypes.ENUM("admin", "employee"),
        allowNull: false,
      },
      ip_address: {
        type: DataTypes.INET,
        allowNull: false,
      },
      request_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      old_data: {
        type: DataTypes.JSONB,
      },
      new_data: {
        type: DataTypes.JSONB,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "audit_logs",
      indexes: [
        {
          fields: ["table_name", "record_id"],
        },
        {
          fields: ["request_id"],
        },
        {
          fields: ["created_at"],
        },
      ],
    }
  );

  return AuditLog;
};
