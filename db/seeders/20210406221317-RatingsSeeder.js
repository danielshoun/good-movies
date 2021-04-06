'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
      return queryInterface.bulkInsert('Ratings', [{
        userId: 1,
        movieId: 1,
        score: 3,
      },
      {
        userId: 1,
        movieId: 2,
        score: 1,
      },
      {
        userId: 1,
        movieId: 3,
        score: 5,
      },
      {
        userId: 1,
        movieId: 4,
        score: 2,
      }
    ], {});
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
