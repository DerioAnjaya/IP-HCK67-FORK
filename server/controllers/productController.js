const { Product } = require('../models')
const { Brand } = require('../models')
const { User } = require('../models')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_environment_variable: process.env.API_ENVIRONMENT_VARIABLE
});

class ProductController {
  static async updateImageUrlById(req, res, next) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        throw { name: "error not found" };
      }

      if (!req.file) {
        throw { name: "Please upload an image" };
      }

      const base64Image = Buffer.from(req.file.buffer).toString("base64");
      const base64Url = `data:${req.file.mimetype};base64,${base64Image}`;

      const result = await cloudinary.uploader.upload(base64Url, {
        public_id: `${req.file.originalname}`,
        folder: "hck67",
      });

      await Product.update(
        {
          imgUrl: result.secure_url,
        },
        {
          where: { id: req.params.id },
        }
      );

      res.status(200).json({
        message: `Image ${product.imgUrl} success to update`,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async addProduct(req, res, next) {
    try {
      req.body.authorId = req.user.id;
      const product = await Product.create(req.body);
      res.status(201).json({
        id: product.id,
        category: product.category,
        name: product.name,
        imgUrl: product.imgUrl,
        description: product.description,
        price: product.price,
        stock: product.stock,
        userId: product.userId,
        brandId: product.brandId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async showProduct(req, res, next) {
    try {
      const allProducts = await Product.findAll({
        include: [{ model: User, attributes: { exclude: ["password"] } }],
      });

      res.status(200).json(allProducts);
    } catch (error) {
      next(error);
    }
  }

  static async showProductById(req, res, next) {
    try {
      const productById = await Product.findByPk(req.params.id);

      if (!productById) {
        throw { name: "error not found" };
      }

      res.status(200).json(productById);
    } catch (error) {
      next(error);
    }
  }

  static async updateProductById(req, res, next) {
    try {
      await Product.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      const afterUpdateProduct = await Product.findByPk(req.params.id);

      if (!afterUpdateProduct) {
        throw { name: "error not found" };
      }

      res.status(200).json({
        id: afterUpdateProduct.id,
        category: afterUpdateProduct.category,
        name: afterUpdateProduct.name,
        imgUrl: afterUpdateProduct.imgUrl,
        description: afterUpdateProduct.description,
        price: afterUpdateProduct.price,
        stock: afterUpdateProduct.stock,
        userId: afterUpdateProduct.userId,
        brandId: afterUpdateProduct.brandId,
        createdAt: afterUpdateProduct.createdAt,
        updatedAt: afterUpdateProduct.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProductById(req, res, next) {
    try {
      const beforeDeleteProduct = await Product.findByPk(req.params.id);

      if (!beforeDeleteProduct) {
        throw { name: "error not found" };
      }

      await Product.destroy({
        where: {
          id: req.params.id,
        },
      });

      res.status(200).json({
        message: `${beforeDeleteProduct.name} success to delete`,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = ProductController
