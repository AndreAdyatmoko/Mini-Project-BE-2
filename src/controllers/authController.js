const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');
const user = db.user;

const authController = {
    register: async (req, res) => {

        try {
            const { username, email, phone, password } = req.body;
            const isEmailExist = await user.findOne({
                where: { email }
            });
            if (isEmailExist) {
                return res.status(500).json({
                    message: "Email atau Username telah digunakan",
                });
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            await db.sequelize.transaction(async (t) => {
                const result = await user.create({
                    username,
                    email,
                    phone,
                    password: hashPassword
                }, { transaction: t });
                return res.status(200).json({
                    message: 'Register success',
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
    login: async (req, res) => {
      try {
          const { email, password } = req.body;

          const checkLogin = await user.findOne({
              where: {
                  email,
                  // password
              }
          });

          // if (!checkLogin) {
          //     return res.status(404).json({
          //         message: "email not found",
          //     })
          // }

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
              message: "Register failed",
              error: err.message
          })
      }
  }
};



module.exports = authController
