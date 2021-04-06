'use strict';
module.exports = (sequelize, DataTypes) => {
  const MovieList = sequelize.define('MovieList', {
    name:{ type: DataTypes.INTEGER, allowNull: false},
    isDefault: { type: DataTypes.BOOLEAN, allowNull: false}
  }, {});
  MovieList.associate = function(models) {
    const columnMapping = {
      through: 'MoviesAndLists', // This is the model name referencing the
    //  join table.
      otherKey: 'movieId',
      foreignKey: 'movieListId'
     }
    MovieList.belongsToMany(models.Movie, {
      foreignKey: 'movieId'
    })
  };
  return MovieList;
};
