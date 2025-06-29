module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
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
      monthly_salary: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "Admin",
          key: "id",
        },
      },
      updated_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "Admin",
          key: "id",
        },
      },
      ip_address: {
        type: DataTypes.INET,
      },
    },
    {
      tableName: "employees",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        beforeCreate: (employee) => {
          employee.created_at = new Date();
          employee.updated_at = new Date();
        },
        beforeUpdate: (employee) => {
          employee.updated_at = new Date();
        },
      },
    }
  );

  // Asosiasi dipindahkan ke bawah setelah model didefinisikan
  Employee.associate = function (models) {
    Employee.belongsTo(models.Admin, {
      as: "createdByAdmin",
      foreignKey: "created_by",
    });

    Employee.belongsTo(models.Admin, {
      as: "updatedByAdmin",
      foreignKey: "updated_by",
    });
    Employee.hasMany(models.Attendance, {
      foreignKey: "employee_id",
      as: "attendances",
    });

    Employee.hasMany(models.Overtime, {
      foreignKey: "employee_id",
      as: "overtimes",
    });

    Employee.hasMany(models.Reimbursement, {
      foreignKey: "employee_id",
      as: "reimbursements",
    });

    Employee.hasMany(models.Payslip, {
      foreignKey: "employee_id",
      as: "payslips",
    });

   
  };

  return Employee;
};
