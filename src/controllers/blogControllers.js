const db = require("../models/");
const Blog = db.blog;

const blogController = {
  getBlogById: async (req, res) => {
    const { id } = req.params;

    try {
      const blog = await Blog.findOne({
        attributes: { exclude: ["blogCategoryId"] },
        where: { id },
        include: [{ model: db.blogCategory }],
      });
      if (!blog) return res.status(404).json("data tidak ada");

      res.status(200).json({ message: "data berhasil didapatkan", data: blog });
    } catch {
      res.status(500).json({ message: "data gagal didapatkan" });
    }
  },

  createBlog: async (req, res) => {
    const {
      title,
      content,
      imgBlog,
      videoUrl,
      keywords,
      categoryId,
      countryId,
    } = req.body;

    try {
      await db.sequelize.transaction(async (t) => {
        const result = await Blog.create(
          {
            title,
            content,
            imgBlog,
            videoUrl,
            keywords,
            categoryId,
            countryId,
            userId: req.user.id,
          },
          { transaction: t }
          );
          console.log(result)

        res.status(200).json({ message: "Blog dibuat", data: result });
      });
    } catch (err) {
      res.status(500).json({ message: "Blog gagal dibuat" });
      console.log(err);
    }
  },

  getBlogbyQuery: async (req, res) => {
    const { title, categoryId, countryId } = req.query;
    const whereClause = {
      title:{ [db.Sequelize.Op.like]: `%${title || ""}%` },};
  }
  if(categoryId){
    whereClause.categoryId = categoryId;
  }
  try {
    const blog = await blog.findAll({
      attributes: { exclude: ["blogCategoryId"] },
      
    })
  }

};

module.exports = blogController;