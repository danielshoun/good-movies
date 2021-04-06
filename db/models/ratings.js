'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ratings = sequelize.define('Ratings', {
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Ratings.associate = function (models) {
    // associations can be defined here
    Ratings.belongsTo(models.User, {foreignKey: 'userId'})
    Ratings.belongsTo(models.Movie, {foreignKey: 'movieId'})
  };
  return Ratings;
};