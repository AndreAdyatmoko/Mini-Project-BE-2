const db = require('../models');
const user = db.user;

const profileController = {
    changeUsername: async (req, res) => {
        try{
            const { newusername } = req.body;
            const loggedInUser = req.loggedInUser; // Mengambil loggedInUser dari req object
            loggedInUser.username = newusername;
            await loggedInUser.save();

            return res.status(200).json({
                message: "Username telah diubah",
                data: loggedInUser
            })
        }catch(error){
            return res.status(500).json({
                message: error.message
            })
        }
    },

    changePhone: async (req, res) => {
        try{
            const { newphone } = req.body;
            const loggedInPhone = req.loggedInPhone; // Mengambil loggedInUser dari req object
            loggedInPhone.phone = newphone;
            await loggedInPhone.save();
            return res.status(200).json({
                message: "Nomor telfon telah dirubah",
                data: loggedInPhone
            })
        }catch(error){
            return res.status(500).json({
                message: error.message
            })
        }
    },
    
    changeEmail: async (req, res) => {
        try{
            const { newemail } = req.body;
            const loggedIn = req.loggedIn; // Mengambil loggedInUser dari req object
            loggedIn.email = newemail;
            await loggedIn.save();
            return res.status(200).json({
                message: "Email telah diubah",
                data: loggedIn
            })
    }catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
    }
}


module.exports = profileController