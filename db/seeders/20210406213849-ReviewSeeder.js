'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Reviews', [
      {
        userId: 1,
        movieId: 1,
        reviewText: "I liked it!!",
      },
      {
        userId: 1,
        movieId: 2,
        reviewText: "I liked it!!",
      },
      {
        userId: 1,
        movieId: 3,
        reviewText: "I liked it!!",
      },
      {
        userId: 1,
        movieId: 4,
        reviewText: "I liked it!!",
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Reviews', null, {});
  }
};
