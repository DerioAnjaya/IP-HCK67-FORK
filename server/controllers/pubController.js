const { Product, sequelize } = require('../models')
const { Brand } = require('../models')
const { User } = require('../models')
const { Op } = require('sequelize')

class PubController {
  static async detailProducts(req, res, next) {
    try {
      const detailProduct = await Product.findByPk(req.params.id);

      if (!detailProduct) {
        throw { name: "error not found" };
      }

      res.status(200).json(detailProduct);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async showProducts(req, res, next) {
    try {
      const { search, sorting, filter, page } = req.query;
      const query = {};
      const limit = 10;

      if (page) {
        query.limit = limit;
        query.offset = limit * (page - 1);
      }
      if (search) {
        query.where = {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        };
      }
      if (sorting) {
        query.order = [["createdAt", sorting]];
      }
      if (filter) {
        query.where = {
          categoryId: filter,
        };
      }

      const allProducts = await Product.findAll(query);
      res.status(200).json(allProducts);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PubController