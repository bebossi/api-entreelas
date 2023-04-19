const database = require("../models");

class ProductController {
  static async createProduct(req, res) {
    try {
      const createdProduct = req.body;
      const newProduct = await database.Product.create(createdProduct);

      return res.status(201).json(newProduct);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
    }
  }

  static async getProducts(req, res) {
    try {
      const products = await database.Product.findAll({
        include: [{ model: database.Category, attributes: ["name"] }],
      });

      return res.status(200).json(products);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async getProduct(req, res) {
    try {
      const { productId } = req.params;
      const product = await database.Product.findOne({
        where: { id: Number(productId) },
      });

      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async updateProduct(req, res) {
    try {
      const { productId } = req.params;
      const newInfo = req.body;
      await database.Product.update(newInfo, {
        where: { id: Number(productId) },
      });
      const product = await database.Products.findOne({
        where: { id: Number(productId) },
      });

      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
}

module.exports = ProductController;
