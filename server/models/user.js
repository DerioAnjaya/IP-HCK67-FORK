"use strict";
const { Model } = require("sequelize");
const { hashPass } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Product, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "username cannot empty",
          },
          notEmpty: {
            msg: "username cannot empty",
          },
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "gender cannot empty",
          },
          notEmpty: {
            msg: "gender cannot empty",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "email must be unique",
        },
        validate: {
          notNull: {
            msg: "email cannot empty",
          },
          notEmpty: {
            msg: "email cannot empty",
          },
          isEmail: {
            msg: "formated email required",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "password cannot empty",
          },
          notEmpty: {
            msg: "password cannot empty",
          },
          minCharSrt(value) {
            if (value.length < 5) {
              throw "minimun 5 characters password";
            }
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "Staff",
        allowNull: false,
        validate: {
          notNull: {
            msg: "role cannot empty",
          },
          notEmpty: {
            msg: "role cannot empty",
          },
        },
      },
      phoneNumber: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: (instance) => {
          instance.password = hashPass(instance.password);
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
