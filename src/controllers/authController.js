const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');




//=====================================CONTOH NANTINYA ==========================================

/*

const authController = {
    register: (req, res) => {
        try {
            const {userName, email, password} = req.body;
            const isEmailExist = await userName.FindOne({
                where: {email}
            });
            if (isEmailExist) {
                return res.status(400).json({
                    message: 'Email is already exist'
                });

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
            }
            await db.sequelize.trasaction( async(t)=> {
                const result = await userName.create({
                    userName,
                    email,
                    password: hashedPassword
                }, {trasaction: t});

                return res.status(200).json({
                    message: 'Register success',
                    data: result
                })
            })
        }
    }

    login: async(req, res) => {
        try{
            const {userName, password} = req.body;
            const checkLogin = await userName.FindOne({
                where: {userName, password}
            });
            if (!checkLogin) {
                return res.status(400).json({
                    message: 'email or password is not correct'
                })
            }

            let payload = {
                id: checkLogin.id,
                userName: checkLogin.userName,
                email: checkLogin.email
            } 

            const token = jwt.sign(payload, process.env.JWT_SECRET, // JWT_SECRET bisa dilihat pada .env yaa...
            {
                expiresIn: '1h'
            });
            return res.status(200).json({
                message: 'Login success',
                data: checkLogin
            })
        }
    }
}

module.exports = authController;


*/