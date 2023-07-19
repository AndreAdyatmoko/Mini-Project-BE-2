const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const user = db.user;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const fs = require('fs').promises;
const handlebars = require('handlebars');

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, phone, password } = req.body;

      const isEmailExist = await user.findOne({
        where: { email }
      });

      if (isEmailExist) {
        return res.status(500).json({
          message: "Email atau Username telah digunakan"
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      await db.sequelize.transaction(async (t) => {
        const result = await user.create(
          {
            username,
            email,
            phone,
            password: hashPassword,
            isVerified: false,
          },
          { transaction: t }
        );

        let payload = { id: result.id };
        const token = jwt.sign(
          payload, process.env.JWT_Key,
          { expiresIn: '1h' });

        const redirect = `http://localhost:3000/auth/verify/${result.id}/${token}`;

        const templatePath = path.resolve(__dirname, '../email/verify.html');
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        const template = handlebars.compile(templateContent);
        const rendered = template({ redirect });

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        // Pengiriman email
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: result.email,
          subject: 'Verifikasi Akun',
          html: rendered
        });

        return res.status(200).json({
          message: ' Verifikasi berhasil',
          data: result
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "Register failed",
        error: error.message
      });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { userId, token } = req.params;

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_Key);
      if (!decoded || decoded.id !== parseInt(userId)) {
        return res.status(400).json({
          message: 'Invalid token'
        });
      }

      // Update isVerified menjadi true
      const updatedUser = await user.update(
        { isVerified: true },
        { where: { id: userId } }
      );

      if (updatedUser) {
        return res.status(200).json({
          message: 'Verifikasi email berhasil',
        });
      } else {
        return res.status(500).json({
          message: 'Gagal memperbarui status verifikasi email',
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Verifikasi email gagal',
        error: error.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const checkLogin = await user.findOne({
        where: {
          email,
        }
      });

      const isValid = await bcrypt.compare(password, checkLogin.password);
      if (!isValid) {
        return res.status(404).json({
          message: "password is incorrect",
        });
      }

      let payload = {
        id: checkLogin.id,
        email: checkLogin.email,
        phone: checkLogin.phone,
        username: checkLogin.username
      };

      const token = jwt.sign(
        payload, process.env.JWT_Key,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: "Login success",
        data: token
      });
    } catch (err) {
      return res.status(500).json({
        message: "Login failed",
        error: err.message
      });
    }
  }
};

module.exports = authController;
