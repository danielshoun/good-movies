'use strict';
const { User, Movie } = require('../models')
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
    return queryInterface.bulkInsert('Reviews', [
      {
        userId: await User.findOne({ where: { username: "demo" } }),
        movieId: await Movie.findOne({ where: { title: 'El Camino: A Breaking Bad Movie' } }),
        reviewText: "This was a great movie",
      },
      // {
      //   userId: await User.findOne({ where: { username: "demo" } }),
      //   movieId: await Movie.findOne({ where: { title: 'Knives Out' } }),
      //   reviewText: "This was a good movie",
      // },
      // {
      //   userId: await User.findOne({ where: { username: "demo" } }),
      //   movieId: await Movie.findOne({ where: { title: 'Extraction' } }),
      //   reviewText: "This was a good movie",
      // },
      // {
      //   userId: await User.findOne({ where: { username: "demo" } }),
      //   movieId: await Movie.findOne({ where: { title: 'Midsommar' } }),
      //   reviewText: "This was a good movie",
      // }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Reviews', null, {});
  }
};
