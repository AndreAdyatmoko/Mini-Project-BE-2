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
      if (!blog) return res.status(404).json({ message: "Data tidak ada" });

      res.status(200).json({ message: "Data berhasil didapatkan", data: blog });
    } catch (err) {
      res.status(500).json({ message: "Data gagal didapatkan" });
    }
  },

  createBlog: async (req, res) => {
    const {title,content,videoUrl,keywords,categoryId,countryId,} = req.body;

    // Pengecekan verifikasi
    
    if (req.user.isVerified === false || 0) {
      return res.status(403).json({ message: "Kamu tidak dapat membuat blog karena belum diverifikasi" });}
    try {
      if (content.length > 500) {
        return res.status(400).json({ message: "Konten terlalu panjang, maksimal 500 karakter" });
      }
      await db.sequelize.transaction(async (t) => {
        const result = await Blog.create(
          { title,
            content,
            imgBlog: req.file ? req.file.filename : null, 
            videoUrl, 
            keywords,
            categoryId,
            countryId, 
            userId: req.user.id,}, { transaction: t });

        res.status(200).json({ message: "Blog dibuat", data: result });
      });
    } catch (err) {
      res.status(500).json({ message: "Blog gagal dibuat" });
      console.log(err);
    }
  },

  getBlogbyQuery: async (req, res) => {
    const { title, categoryId, orderBy } = req.query;
    const whereClause = {
      title: { [db.Sequelize.Op.like]: `%${title || ""}%` },
    };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    try {
      const blogs = await Blog.findAll({
        attributes: { exclude: ["blogCategoryId"] },
        where: whereClause,
        include: [{ model: db.blogCategory }],
        order: [['createdAt', orderBy || 'DESC']],
      });
      res.status(200).json({ message: "Data berhasil diperoleh", data: blogs });
    } catch (err) {
      res.status(500).json({ message: "Data gagal diperoleh" });
    }
  },

  getBlogsByQueryWithPagination: async (req, res) => {
    const { title, categoryId, orderBy, page } = req.query;
    const limit = 10; // Jumlah data per halaman
    const offset = limit * (page - 1); // Hitung offset berdasarkan halaman

    const whereClause = {
      title: { [db.Sequelize.Op.like]: `%${title || ""}%` },
    };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    try {
      const blogs = await Blog.findAndCountAll({
        attributes: { exclude: ["blogCategoryId"] },
        where: whereClause,
        include: [{ model: db.blogCategory }],
        order: [['createdAt', orderBy || 'DESC']],
        limit,
        offset,
      });

      const totalPages = Math.ceil(blogs.count / limit);
      res.status(200).json({
        message: "Data berhasil diperoleh",
        data: blogs.rows,
        currentPage: parseInt(page),
        totalPages,
      });
    } catch (err) {
      res.status(500).json({ message: "Data gagal diperoleh" });
    }
  },
};

module.exports = blogController;
