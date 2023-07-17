"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
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
      verificationCode: DataTypes.STRING, // Kolom untuk menyimpan kode verifikasi
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
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
