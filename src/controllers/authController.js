const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');
const user = db.user;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { sendVerificationEmail } = require('../helper/emailHelper');
usedTokens = new Set();

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, phone, password } = req.body;
      const isEmailExist = await user.findOne({
        where: { email } });
      if (isEmailExist) {
        return res.status(500).json({
          message: "Email atau Username telah digunakan" })}
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await db.sequelize.transaction(async (t) => {
        const result = await user.create(
          {
            username, email, phone,
            password: hashPassword, isVerified: false,
          },
          { transaction: t } );
        let payload = { id: result.id };
        const token = jwt.sign(
          payload, process.env.JWT_Key,
          { expiresIn: '1h' });
        const redirect = `http://localhost:3000/auth/verify/${result.id}/${token}`;
        await sendVerificationEmail(result.email, redirect);
        return res.status(200).json({
          message: ' Registrasi berhasil silahkan cek email untuk verifikasi akun',
          data: result
        });
      });
    } catch (error) {
      return res.status(500).json({message: "Register failed",error: error.message});
    }},
 
  verifyEmail: async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
      const { id } = req.params;
      if (usedTokens.has(token)) {
        return res.status(400).json({
          message: 'Token has already been used for verification'
        })} 
      const decoded = jwt.verify(token, process.env.JWT_Key);
      if (!decoded || decoded.id !== parseInt(id)) {
        return res.status(400).json({
          message: 'Invalid token'
        })}
      usedTokens.add(token);
      setTimeout(() => usedTokens.delete(token), 60000); // Expire the token after 1 minute (60000 milliseconds)
      const updatedUser = await user.update(
        { isVerified: true },
        { where: { id: id } }
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
      if(user.isVerified === false){
        return res.status(404).json({
          message: "Kamu belum terverifikasi"
        });
      }

      let payload = {
        id: checkLogin.id,
        email: checkLogin.email,
        phone: checkLogin.phone,
        username: checkLogin.username,
        isVerified: checkLogin.isVerified
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
