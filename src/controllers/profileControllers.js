const db = require('../models');
const user = db.user;
const fs = require("fs").promises;
const bcrypt = require('bcrypt');


const profileController = {
    changeUsername: async (req, res) => {
        try{
            const { newusername } = req.body;
            const loggedInUser = req.loggedInUser; // Mengambil loggedInUser dari req object
            loggedInUser.username = newusername;
            await loggedInUser.save();

            return res.status(200).json({
                message: "Username telah diubah cek Email ya 😉",
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
                message: "Nomor telfon telah dirubah cek email ya 😉",
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
                message: "Email telah diubah cek email ya 😉",
                data: loggedIn
            })
    }catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
    },

    changeImage: async (req, res) => {
        try {
          const { id } = req.user;
              const oldAva = await user.findOne({ where: { id } });
          
              if (oldAva.imgProfile) {
            fs.unlink(oldAva.imgProfile, (err) => {
              if (err) return res.status(500).json({
                message: "ada kesalahan",
                error: err.message
              });
            });
        }
            await db.sequelize.transaction(async (t) => {
              const result = await user.update(
                { imgProfile: req.file.path },
                { where: { id } },
                {transaction: t }
              );

              return res.status(200).json({
                message: "gambar berhasil diubah 😉",
                data: result
              });
            });
          
        } catch (error) {
          return res.status(500).json({
            message: "gambar gagal diubah",
            error: error.message
          });
        }
      },

      changePassword : async (req, res) => {
        
        try {
          const { oldpassword, newpassword, confirmNewPassword } = req.body;
          console.log(req.user);

          const tes = await user.findOne({where: { id: req.user.id }});

          const checkOldPassword = await bcrypt.compare(oldpassword, tes.password);
            if (!checkOldPassword){
                return res.status(404).json({message: "password lama salah"});
            }
            if (newpassword !== confirmNewPassword){
                return res.status(404).json({message: "password tidak sama"});
            }
            
            const salt = await bcrypt.genSalt(10);
            const hashNewPassword = await bcrypt.hash(newpassword, salt);

            const update = await user.update(
              {password: hashNewPassword},
              { where:  { id: tes.id } }
              );
              res.status(200).json({message: "password berhasil diubah"});
          } catch (error) {
              res.status(500).json({message: error.message});
          }
      }
}


module.exports = profileController