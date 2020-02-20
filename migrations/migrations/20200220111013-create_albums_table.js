'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('albums', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE },
      album_id: { type: Sequelize.INTEGER, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      user_id: { type: Sequelize.INTEGER, allowNull: false }
    })
};
