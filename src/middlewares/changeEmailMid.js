const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const handlebars = require('handlebars');
const {user} = require('../models')

const changeEmailMiddleware = async (req, res, next) => {
    try {
        const { currentemail, newemail } = req.body;
        const loggedIn = await user.findOne({
            where: { email: currentemail }
        });
        if (!loggedIn) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }
        
        const previousEmail = loggedIn.email;
        loggedIn.email = newemail;
        await loggedIn.save();

        // Mengirim email notifikasi perubahan email
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
        const templatePath = path.resolve(__dirname, '../email/emailChanged.html');
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        const template = handlebars.compile(templateContent);
        const rendered = template({ previousEmail, newEmail: loggedIn.email });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: loggedIn.email,
            subject: 'Perubahan Email',
            html: rendered
        });
        req.loggedIn = loggedIn; // Menyimpan logginUser di request object
        next();
    }catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = changeEmailMiddleware;