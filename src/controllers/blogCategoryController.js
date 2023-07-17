const db = require("../models/");
const Category = db.blogCategory;

const blogCategoryController = {
  createCategory: async (req, res) => {
    const { name } = req.body;

    try {
      await db.sequelize.transaction(async (t) => {
        const result = await Category.create(
          {
            name,
          },
          { transaction: t }
        );
        return res.status(200).json({
          message: "Data berhasil dibuat",
          data: result,
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "Data gagal dibuat",
        error: error.message,
      });
    }
  },

  getCategory: async (req, res) => {
    try {
      const result = await Category.findAll();
      return res.status(200).json({
        message: "Data berhasil didapatkan",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Data gagal didapatkan",
        error: error.message,
      });
    }
  },
};

module.exports = blogCategoryController;
