module.exports = (sequelize, DataTypes) => {
  const PayrollPeriod = sequelize.define(
    "PayrollPeriod",
    {
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isAfterStart(value) {
            if (value <= this.start_date) {
              throw new Error("End date must be after start date");
            }
          },
        },
      },
      is_processed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "admins",
          key: "id",
        },
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "admins",
          key: "id",
        },
      },
      ip_address: {
        type: DataTypes.INET,
      },
    },
    {
      tableName: "payroll_periods",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        beforeCreate: (period) => {
          period.created_at = new Date();
          period.updated_at = new Date();
        },
        beforeUpdate: (period) => {
          period.updated_at = new Date();
        },
      },
    }
  );

//   PayrollPeriod.associate = function (models) {
//     PayrollPeriod.hasMany(models.Attendance, {
//       foreignKey: "payroll_period_id",
//     });
//     PayrollPeriod.hasMany(models.Overtime, { foreignKey: "payroll_period_id" });
//     PayrollPeriod.hasMany(models.Reimbursement, {
//       foreignKey: "payroll_period_id",
//     });
//     PayrollPeriod.hasMany(models.Payslip, { foreignKey: "payroll_period_id" });
//     PayrollPeriod.belongsTo(models.Admin, {
//       as: "createdByAdmin",
//       foreignKey: "created_by",
//     });
//     PayrollPeriod.belongsTo(models.Admin, {
//       as: "updatedByAdmin",
//       foreignKey: "updated_by",
//     });
//   };

  return PayrollPeriod;
};
