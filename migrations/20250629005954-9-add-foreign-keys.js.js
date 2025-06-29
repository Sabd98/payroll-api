"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Tambahkan foreign keys untuk employees
      await queryInterface.addConstraint("employees", {
        fields: ["created_by"],
        type: "foreign key",
        name: "fk_employees_created_by",
        references: {
          table: "admins",
          field: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        transaction,
      });

      await queryInterface.addConstraint("employees", {
        fields: ["updated_by"],
        type: "foreign key",
        name: "fk_employees_updated_by",
        references: {
          table: "admins",
          field: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        transaction,
      });

      // 2. Tambahkan foreign key untuk reimbursements ke payslips
      // SEKARANG KOLOM SUDAH ADA, BISA DITAMBAHKAN CONSTRAINT
      await queryInterface.addConstraint("reimbursements", {
        fields: ["payslip_id"],
        type: "foreign key",
        name: "fk_reimbursements_payslip_id",
        references: {
          table: "payslips",
          field: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint(
      "employees",
      "fk_employees_created_by"
    );
    await queryInterface.removeConstraint(
      "employees",
      "fk_employees_updated_by"
    );
    await queryInterface.removeConstraint(
      "reimbursements",
      "fk_reimbursements_payslip_id"
    );
  },
};
