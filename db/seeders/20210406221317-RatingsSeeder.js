'use strict';
const { Review } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
			const reviews = await Review.findAll();

			const ratings = [];

			reviews.forEach(review => {
				ratings.push({
					userId: review.userId,
					movieId: review.movieId,
					score: Math.floor(Math.random() * 5) + 1
				})
			})

      return queryInterface.bulkInsert('Ratings', ratings, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
      return queryInterface.bulkDelete('Ratings', null, {});

  }
};
