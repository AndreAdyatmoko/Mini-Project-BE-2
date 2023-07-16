const { Blog } = require('../models');

const blogController = {
  createBlog: async (req, res) => {
    try {
      const { title, author, publicationDate, imageLink, category, content, videoLink, keywords, country } = req.body;

      // Simpan data blog baru ke database
      const newBlog = await Blog.create({
        title,
        author,
        publicationDate,
        imageLink,
        category,
        content,
        videoLink,
        keywords,
        country
      });

      res.status(201).json({ message: 'Blog created successfully', data: newBlog });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getBlogs: async (req, res) => {
    try {
      // Ambil semua data blog dari database
      const blogs = await Blog.findAll();

      res.status(200).json({ data: blogs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getBlogById: async (req, res) => {
    try {
      const { blogId } = req.params;

      // Ambil data blog berdasarkan ID dari database
      const blog = await Blog.findByPk(blogId);

      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      res.status(200).json({ data: blog });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateBlog: async (req, res) => {
    try {
      const { blogId } = req.params;
      const { title, author, publicationDate, imageLink, category, content, videoLink, keywords, country } = req.body;

      // Cek apakah blog ada dalam database
      const existingBlog = await Blog.findByPk(blogId);
      if (!existingBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      // Update data blog
      await existingBlog.update({
        title,
        author,
        publicationDate,
        imageLink,
        category,
        content,
        videoLink,
        keywords,
        country
      });

      res.status(200).json({ message: 'Blog updated successfully', data: existingBlog });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const { blogId } = req.params;

      // Cek apakah blog ada dalam database
      const existingBlog = await Blog.findByPk(blogId);
      if (!existingBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      // Hapus blog dari database
      await existingBlog.destroy();

      res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = blogController;
