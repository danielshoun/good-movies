'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert(
			'Reviews',
			[
				{
					userId: 1,
					movieId: 1,
					reviewText: 'I liked it!!',
				},
				{
					userId: 1,
					movieId: 2,
					reviewText: 'I liked it!!',
				},
				{
					userId: 1,
					movieId: 3,
					reviewText: 'I liked it!!',
				},
				{
					userId: 1,
					movieId: 4,
					reviewText: 'I liked it!!',
				},
				{
					userId: 1,
					movieId: 15,
					reviewText: 'I liked it!!',
				},
				{
					userId: 1,
					movieId: 15,
					reviewText:
						'pleasant halfway income cattle goose cave mountain chief pocket song affect yes interest vegetable burn tin dirty surprise now visit airplane square burst caughtI liked it!!',
				},
				{
					userId: 1,
					movieId: 15,
					reviewText:
						'height major row degree difference grown drew characteristic frighten tone wore flag its stronger ought too whatever children several twelve with kitchen during onceI liked it!!',
				},
				{
					userId: 1,
					movieId: 15,
					reviewText:
						'dead differ foreign friendly slave silver wave popular vessels anything turn shop are slow wire provide radio somewhere reason time shirt castle including fatI liked it!!',
				},
				{
					userId: 1,
					movieId: 15,
					reviewText:
						'rather fairly correct her pay wrapped necessary valuable solar voyage war produce start grow care judge disappear same three spread rose fought reader circusI liked it!!',
				},
				{
					userId: 1,
					movieId: 15,
					reviewText:
						'fell gather little rhyme heart pencil valuable smoke depth kind maybe available spend making pond roof wet her ants his tank south atomic upI liked it!!',
				},
			],
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
