const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const handlebars = require('handlebars');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

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

const sendVerificationEmail = async (email, redirect) => {
  try {
    const templatePath = path.resolve(__dirname, '../email/verify.html');
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);
    const rendered = template({ redirect });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Verifikasi Akun',
      html: rendered
    });
  } catch (error) {
    console.log('Error sending verification email:', error);
  }
};

module.exports = {
  transporter,
  sendVerificationEmail,
};
