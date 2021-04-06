'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('MoviesAndLists', [
     {
       movieId: 1,
       movieListId: 1
     },
     {
       movieId: 1,
       movieListId: 2
     },
     {
       movieId: 1,
       movieListId: 3
     },
     {
       movieId: 1,
       movieListId: 4
     }
   ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('MoviesAndLists', null, {});
  }
};
