'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Rating.associate = function (models) {
    // associations can be defined here
    Rating.belongsTo(models.User, {foreignKey: 'userId'})
    Rating.belongsTo(models.Movie, {foreignKey: 'movieId'})
  };
  return Rating;
};