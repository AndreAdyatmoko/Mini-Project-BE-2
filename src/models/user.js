"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class user extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.hasMany(models.blog, { foreignKey: "userId" });
		}
	}
	user.init(
		{
			username: {
				type: DataTypes.STRING,
				// unique: true,
			},
			email: {
				type: DataTypes.STRING,
				// unique: true,
			},
			phone: {
				type: DataTypes.STRING,
				// unique: true,
			},
			password: DataTypes.STRING,
			imgProfile: DataTypes.STRING,
			isVerified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			createdAt: {
				// allowNull: true,
				type: DataTypes.DATE,
			},
			updatedAt: {
				// allowNull: true,
				type: DataTypes.DATE,
			},
		},
		{
			sequelize,
			modelName: "user",
		}
	);
	return user;
};