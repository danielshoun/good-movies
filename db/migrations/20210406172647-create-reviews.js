'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Reviews', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'Users' },
			},
			movieId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'Movies' },
			},
			reviewText: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			createdAt: {
				defaultValue: Sequelize.fn('now'),
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				defaultValue: Sequelize.fn('now'),
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Reviews');
	},
};
