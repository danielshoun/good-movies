'use strict';
module.exports = (sequelize, DataTypes) => {
  const MoviesAndLists = sequelize.define('MoviesAndLists', {
    movieId: DataTypes.INTEGER,
    movieListId: DataTypes.INTEGER
  }, {});
  MoviesAndLists.associate = function (models) {

  };
  return MoviesAndLists;
};
