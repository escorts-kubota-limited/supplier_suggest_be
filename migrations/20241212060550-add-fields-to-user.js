'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'email', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Users', 'name', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Users', 'department_id', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('Users', 'usertype', { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 });
    
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'email');
    await queryInterface.removeColumn('Users', 'name');
    await queryInterface.removeColumn('Users', 'department_id');
    await queryInterface.removeColumn('Users', 'usertype');
  },
};
