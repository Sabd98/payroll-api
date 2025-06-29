module.exports = (sequelize, DataTypes) => {
  const Reimbursement = sequelize.define(
    "Reimbursement",
    {
      payslip_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "payslips",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      submission_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
      tableName: "reimbursements",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        beforeCreate: (reimbursement) => {
          reimbursement.created_at = new Date();
          reimbursement.updated_at = new Date();
        },
        beforeUpdate: (reimbursement) => {
          reimbursement.updated_at = new Date();
        },
      },
    }
  );

  Reimbursement.associate = function (models) {
    Reimbursement.belongsTo(models.Employee, {
      foreignKey: "employee_id",
      as: "employee",
    });

    Reimbursement.belongsTo(models.PayrollPeriod, {
      foreignKey: "payroll_period_id",
      as: "payroll_period",
    });

    Reimbursement.belongsTo(models.Employee, {
      as: "createdByEmployee",
      foreignKey: "created_by",
    });

    Reimbursement.belongsTo(models.Employee, {
      as: "updatedByEmployee",
      foreignKey: "updated_by",
    });

    Reimbursement.belongsTo(models.Payslip, {
      foreignKey: "payslip_id",
      as: "payslip",
    });
  };

  return Reimbursement;
};
