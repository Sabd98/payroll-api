module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "Attendance",
    {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notWeekend(value) {
            const day = new Date(value).getDay();
            if (day === 0 || day === 6) {
              throw new Error("Attendance not allowed on weekends");
            }
          },
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
      tableName: "attendances",
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
        beforeCreate: (attendance) => {
          attendance.created_at = new Date();
          attendance.updated_at = new Date();
        },
        beforeUpdate: (attendance) => {
          attendance.updated_at = new Date();
        },
      },
    }
  );

  Attendance.associate = function (models) {
    Attendance.belongsTo(models.Employee, { foreignKey: "employee_id" });
    Attendance.belongsTo(models.PayrollPeriod, {
      foreignKey: "payroll_period_id",
    });
    Attendance.belongsTo(models.Employee, {
      as: "createdByEmployee",
      foreignKey: "created_by",
    });
    Attendance.belongsTo(models.Employee, {
      as: "updatedByEmployee",
      foreignKey: "updated_by",
    });
  };

  return Attendance;
};
