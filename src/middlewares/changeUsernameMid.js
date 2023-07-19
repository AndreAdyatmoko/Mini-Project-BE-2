const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const handlebars = require('handlebars');
const { user } = require('../models');

const changeUsernameMiddleware = async (req, res, next) => {
  try {
    const { currentusername, newusername } = req.body;
    const loggedInUser = await user.findOne({
      where: { username: currentusername }
    });

    if (!loggedInUser) {
      return res.status(404).json({
        message: "User tidak ditemukan"
      });
    }

    const previousUsername = loggedInUser.username;
    loggedInUser.username = newusername;
    await loggedInUser.save();

    // Mengirim email notifikasi perubahan username
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

    const templatePath = path.resolve(__dirname, '../email/usernameChanged.html');
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);
    const rendered = template({ previousUsername, newUsername: loggedInUser.username });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: loggedInUser.email,
      subject: 'Perubahan Username',
      html: rendered
    });
    req.loggedInUser = loggedInUser; // Menyimpan logginUser di request object
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = changeUsernameMiddleware;
