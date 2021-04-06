'use strict';
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    releaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    runTime: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    genres: {
      type: DataTypes.ARRAY(DataTypes.STRING(50)),
      allowNull: false
    },
    director: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cast: {
      type: DataTypes.ARRAY(DataTypes.STRING(255)),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    productionCompany: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    imdbRating: {
      type: DataTypes.NUMERIC(2, 1),
      allowNull: false
    },
    awards: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    mpaaRating: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    plot: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {});
  Movie.associate = function(models) {
    // associations can be defined here
  };
  return Movie;
};