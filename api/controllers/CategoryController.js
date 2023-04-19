const database = require("../models");

class CategoryController {
  static async getCategorys(req, res) {
    try {
      const categorys = await database.Category.findAll();

      return res.status(200).json(categorys);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async getCategory(req, res) {
    try {
      const { categoryName } = req.params;

      const category = await database.Category.findOne({
        where: { name: categoryName },
      });
      return res.status(200).json(category);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async updateCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const newInfo = req.body;
      await database.Category.update(newInfo, {
        where: { id: Number(categoryId) },
      });

      const updatedCategory = await database.Category.findOne({
        where: { id: Number(categoryId) },
      });
      return res.status(200).json(updatedCategory);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async createCategory(req, res) {
    try {
      const newCategory = req.body;
      const createdCategory = await database.Category.create(newCategory);

      return res.status(201).json(createdCategory);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
    }
  }

  static async deleteCategory(req, res) {
    try {
      const { categoryId } = req.params;
      await database.Category.destroy({ where: { id: Number(categoryId) } });

      return res
        .status(200)
        .json({ message: `The category ${categoryId} was complete deleted` });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
}

module.exports = CategoryController;
