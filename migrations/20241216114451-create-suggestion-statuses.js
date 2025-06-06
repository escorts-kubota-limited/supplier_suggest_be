'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("suggestion_statuses", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      suggestion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Suggestions", // References the "suggestions" table
          key: "id",
        },
        onDelete: "CASCADE", // Automatically delete statuses if suggestion is deleted
      },
      status: {
        type: Sequelize.ENUM("in review", "approved", "declined"),
        allowNull: false,
        defaultValue: "in review",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("suggestion_statuses");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
