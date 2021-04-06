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
      return queryInterface.bulkInsert('MovieLists', [
        {
          userId: 1,
          name: "Watched",
          isDefault: true,
        },
        {
          userId: 1,
          name: "To Watch",
          isDefault: true,
        },
        {
          userId: 1,
          name: "First List",
          isDefault: false,
        },
        {
          userId: 1,
          name: "Second List",
          isDefault: false,
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
      return queryInterface.bulkDelete('MovieLists', null, {});

  }
};
