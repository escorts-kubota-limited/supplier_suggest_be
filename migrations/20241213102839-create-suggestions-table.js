'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Suggestions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      submitted_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      supplier_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      supplier_representative: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      buyer_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      buyer_email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      department: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      improvement_category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      idea: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      ekl_part_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ekl_part_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      benefit: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      change_points: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      before_implementation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      after_implementation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      benefit_after_implementation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      attachments: {
        type: Sequelize.JSON, // Array of file URLs
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Suggestions');

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
