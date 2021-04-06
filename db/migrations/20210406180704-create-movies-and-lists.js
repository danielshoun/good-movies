'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MoviesAndLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      movieId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model: "Movies" }
      },
      movieListId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model: "MovieLists" }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('MoviesAndLists');
  }
};
