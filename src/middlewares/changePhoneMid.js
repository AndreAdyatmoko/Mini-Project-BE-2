const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const handlebars = require('handlebars');
const { user } = require('../models');

const changePhoneMiddleware = async (req, res, next) => {
    try {
        const { currentphone, newphone } = req.body;
        const loggedInPhone = await user.findOne({
            where: { phone: currentphone }
        });
        if (!loggedInPhone) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }

        const previousPhone = loggedInPhone.phone;
        loggedInPhone.phone = newphone;
        await loggedInPhone.save();

        // Mengirim email notifikasi perubahan nomor telepon
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
        const templatePath = path.resolve(__dirname, '../email/phoneChanged.html');
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        const template = handlebars.compile(templateContent);
        const rendered = template({ previousPhone, newPhone: loggedInPhone.phone });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: loggedInPhone.email,
            subject: 'Perubahan Nomor Telepon',
            html: rendered
        });

        req.loggedInPhone = loggedInPhone; // Menyimpan loggedInUser di request object
        next();
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = changePhoneMiddleware;
