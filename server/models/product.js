"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Brand, { foreignKey: "brandId" });
      Product.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Product.init(
    {
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "category cannot empty",
          },
          notEmpty: {
            msg: "category cannot empty",
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "name cannot empty",
          },
          notEmpty: {
            msg: "name cannot empty",
          },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "imgUrl cannot empty",
          },
          notEmpty: {
            msg: "imgUrl cannot empty",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "description cannot empty",
          },
          notEmpty: {
            msg: "description cannot empty",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "price cannot empty",
          },
          notEmpty: {
            msg: "price cannot empty",
          },
          pricing(value) {
            if (value < 1000) {
              throw "price must be above 1000";
            }
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "stock cannot empty",
          },
          notEmpty: {
            msg: "stock cannot empty",
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        },
        validate: {
          notNull: {
            msg: "userId cannot empty",
          },
          notEmpty: {
            msg: "userId cannot empty",
          },
        },
      },
      brandId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Brands",
          key: "id"
        },
        validate: {
          notNull: {
            msg: "price cannot empty",
          },
          notEmpty: {
            msg: "price cannot empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
