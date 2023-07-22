const db = require("../models/");
const Country = db.blogCountry;

const blogCountryController = {
  createCountry: async (req, res) => {
    const { name } = req.body;
    try {
      await db.sequelize.transaction(async (t) => {
        const result = await Country.create({ name }, { transaction: t });
      });
      return res.status(200).json({ message: "country baru berhasil dibuat" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "country baru tidak berhasil dibuat", err });
    }
  },

  getCountry: async (req, res) => {
    try {
      const result = await Country.findAll();
      res
        .status(200)
        .json({ message: "data berhasil didapatkan", data: result });
    } catch {
      res.status(500).json({ message: "data tidak berhasil didapatkan" });
    }
  },
};

module.exports = blogCountryController;