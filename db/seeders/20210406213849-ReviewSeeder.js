'use strict';
const faker = require('faker');

module.exports = {
	up: (queryInterface, Sequelize) => {

		let usedPairs = {}
		let reviews = []

		for(let i = 0; i < 5000; i++) {
			let randUserId = Math.floor(Math.random() * 49) + 1
			let randMovieId = Math.floor(Math.random() * 996) + 1
			if(!usedPairs[randUserId]) {
				usedPairs[randUserId] = [randMovieId]
				reviews.push({
					userId: randUserId,
					movieId: randMovieId,
					reviewText: faker.lorem.paragraph()
				})
			} else {
				while(usedPairs[randUserId].includes(randMovieId)) {
					randMovieId = Math.floor(Math.random() * 997)
				}
				reviews.push({
					userId: randUserId,
					movieId: randMovieId,
					reviewText: faker.lorem.paragraph()
				})
				usedPairs[randUserId].push(randMovieId)
			}
		}

		return queryInterface.bulkInsert(
			'Reviews',
			reviews,
			{}
		);
	},

	down: (queryInterface, Sequelize) => {
		/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
		return queryInterface.bulkDelete('Reviews', null, {});
	},
};
