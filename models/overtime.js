module.exports = (sequelize, DataTypes) => {
  const Overtime = sequelize.define(
    "Overtime",
    {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hours: {
        type: DataTypes.DECIMAL(4, 1),
        allowNull: false,
        validate: {
          min: 0.1,
          max: 3.0,
        },
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "Employees",
          key: "id",
        },
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "Employees",
          key: "id",
        },
      },
      ip_address: {
        type: DataTypes.INET,
      },
    },
    {
      tableName: "overtimes",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["employee_id", "date"],
        },
      ],
      hooks: {
        beforeCreate: (overtime) => {
          overtime.created_at = new Date();
          overtime.updated_at = new Date();
        },
        beforeUpdate: (overtime) => {
          overtime.updated_at = new Date();
        },
        beforeValidate: (overtime) => {
          if (new Date(overtime.date) > new Date()) {
            throw new Error("Overtime date cannot be in the future");
          }
        },
      },
    }
  );

  Overtime.associate = function (models) {
    Overtime.belongsTo(models.Employee, { foreignKey: "employee_id" });
    Overtime.belongsTo(models.PayrollPeriod, {
      foreignKey: "payroll_period_id",
    });
    Overtime.belongsTo(models.Employee, {
      as: "createdByEmployee",
      foreignKey: "created_by",
    });
    Overtime.belongsTo(models.Employee, {
      as: "updatedByEmployee",
      foreignKey: "updated_by",
    });
  };

  return Overtime;
};
