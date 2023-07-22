const path = require('path');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const handlebars = require('handlebars');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const Modeluser = db.user;
const bcrypt = require('bcrypt');

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

const validateForgotPassword = () => {
    return [body("email").isEmail().withMessage("Email tidak valid")];
}

const sendResetPassword = async (email) => {
    const user = await Modeluser.findOne({
        where: { email: email }
    });
    if (!user) {
        throw new Error("User tidak ditemukan");
    }
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        phone: user.phone,
    }, process.env.JWT_Key, { expiresIn: '1h' });
    return token;
}

const sendMail = async (email, token) => {
    const templatePath = path.resolve(__dirname, '../email/forgotPassword.html');
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);
    const html = template({
        redirect: `http://localhost:3000/reset/forgot/${token}`
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Password",
        html: html
    });
}

const forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
        const token = await sendResetPassword(email);
        await sendMail(email, token);
        return res.status(200).json({ message: "Reset password email dikirim" });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }

}

const resetPassword = async (req, res) => {
    
    const  token  = req.headers.authorization?.split(" ")[1];
    const {password} = req.body;

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_Key);
        const user = await Modeluser.findOne({
            where: { id: decodedToken.id }
        })
        if(!user){
            return res.status(400).json({message: "User tidak ditemukan"});
        } 
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if(err) {
                    return res.status(500).json({ message: "Error saat menghash password" });
                }
                user.password = hash;
                await user.save();
                res.status(200).json({message: "Password berhasil diubah"});
            })
        })
    }catch (error) {
        return res.status(400).json({message: error.message});
    }
}

module.exports = {
    validateForgotPassword,
    forgotPassword,
    resetPassword
}
