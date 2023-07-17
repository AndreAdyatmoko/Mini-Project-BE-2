const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const user = db.user;

function generateVerificationCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

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
      const verificationCode = generateVerificationCode();
      
      await db.sequelize.transaction(async (t) => {
        const result = await user.create(
          {
            username,
            email,
            phone,
            password: hashPassword,
            isVerified: false,
            verificationCode
          },
          { transaction: t }
        );

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          },
          host: 'smtp.gmail.com',
          port: 587,
          secure: false
        });

        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'Verifikasi Akun',
          text: `Hai Kakak, verif emailnya disini biar bisa login ya 😉! Kode Verifikasi: ${verificationCode}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        return res.status(200).json({
          message: 'Mengirim email verifikasi',
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

  verifyAccount: async (req, res) => {
    try {
      const { email, verificationCode } = req.body;
      const existingUser = await user.findOne({
        where: {
          email,
          verificationCode
        }
      });

      if (!existingUser) {
        return res.status(404).json({
          message: "Kode verifikasi tidak valid"
        });
      }

      await user.update(
        { isVerified: true },
        { where: { email } }
      );

      return res.status(200).json({
        message: "Verifikasi berhasil",
        data: existingUser
      });
    } catch (error) {
      return res.status(500).json({
        message: "Verifikasi gagal",
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
              })
          }

          let payload = { 
              id: checkLogin.id,
              email: checkLogin.email,
              phone: checkLogin.phone,
              username: checkLogin.username
          }

          const token = jwt.sign(
              payload, 
              process.env.JWT_Key,
              {
                  expiresIn: '1h'
              }
          )

          return res.status(200).json({
              message: "Login success",
              data: token
          })
      } catch (err) {
          return res.status(500).json({
              message: "Login failed",
              error: err.message
          })
      }
  }
};



module.exports = authController
