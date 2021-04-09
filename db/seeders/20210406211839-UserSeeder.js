'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    let users = [{
      username: 'demo',
      email: 'demo@demo.com',
      hashedPassword: await bcrypt.hash('demopassworD1!', 10)
    }]

    for (let i = 0; i < 49; i++) {
      users.push({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        hashedPassword: await bcrypt.hash(faker.internet.password(), 10)
      })
    }

    return queryInterface.bulkInsert('Users', users, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Users', null, {});
  }
};
