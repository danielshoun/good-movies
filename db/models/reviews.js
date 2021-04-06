'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reviews = sequelize.define('Reviews', {
    reviewText: {
      type: DataTypes.INTEGER
    }
  }, {});
  Reviews.associate = function (models) {
    // associations can be defined here
    Reviews.belongsTo(models.User, {foreignKey: 'userId'})
    Reviews.belongsTo(models.Movie, {foreignKey: 'movieId'})
  };
  return Reviews;
};