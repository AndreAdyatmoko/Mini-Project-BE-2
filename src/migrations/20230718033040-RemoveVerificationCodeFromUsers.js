'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Kosongkan saja, karena ini adalah migration untuk menghapus kolom
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'verificationCode');
  }
};
