'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    reviewText: {
      type: DataTypes.TEXT
    }
  }, {});
  Review.associate = function (models) {
    // associations can be defined here
    Review.belongsTo(models.User, {foreignKey: 'userId'})
    Review.belongsTo(models.Movie, {foreignKey: 'movieId'})
  };
  return Review;
};
