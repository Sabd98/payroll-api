module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
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
      tableName: "admins",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        beforeUpdate: (admin) => {
          admin.updated_at = new Date();
        },
      },
    }
  );

  Admin.associate = function (models) {
    Admin.hasMany(models.PayrollPeriod, {
      as: "createdPayrollPeriods",
      foreignKey: "created_by",
    });
    Admin.hasMany(models.PayrollPeriod, {
      as: "updatedPayrollPeriods",
      foreignKey: "updated_by",
    });
    Admin.hasMany(models.Payslip, {
      as: "createdPayslips",
      foreignKey: "created_by",
    });
  };

  return Admin;
};
