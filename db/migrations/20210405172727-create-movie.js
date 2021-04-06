'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      releaseDate: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      runTime: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      genres: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING(50))
      },
      director: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      cast: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING(255))
      },
      country: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      productionCompany: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      imdbRating: {
        allowNull: false,
        type: Sequelize.NUMERIC(2, 1)
      },
      awards: {
        type: Sequelize.STRING(255)
      },
      mpaaRating: {
        allowNull: false,
        type: Sequelize.STRING(16)
      },
      plot: {
        allowNull: false,
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('Movies');
  }
};