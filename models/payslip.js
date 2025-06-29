module.exports = (sequelize, DataTypes) => {
  const Payslip = sequelize.define(
    "Payslip",
    {
      base_salary: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      overtime_pay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      total_reimbursements: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      total_pay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      ip_address: {
        type: DataTypes.INET,
      },
    },
    {
      tableName: "payslips",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["employee_id", "payroll_period_id"],
        },
      ],
      hooks: {
        beforeCreate: (payslip) => {
          payslip.created_at = new Date();
          payslip.updated_at = new Date();
        },
        beforeUpdate: (payslip) => {
          payslip.updated_at = new Date();
        },
      },
    }
  );

  Payslip.associate = function (models) {
    Payslip.belongsTo(models.Employee, { foreignKey: "employee_id" });
    Payslip.belongsTo(models.PayrollPeriod, {
      foreignKey: "payroll_period_id",
    });
    Payslip.belongsTo(models.Admin, {
      as: "createdByAdmin",
      foreignKey: "created_by",
    });
    Payslip.belongsTo(models.Admin, {
      as: "updatedByAdmin",
      foreignKey: "updated_by",
    });
    Payslip.hasMany(models.Reimbursement, {
      foreignKey: "payslip_id",
      as: "reimbursements",
    });
  };

  return Payslip;
};
