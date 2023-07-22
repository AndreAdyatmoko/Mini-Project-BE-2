const db = require('../models');
const User = db.user;

const isVerified = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      },
    });

    if (!user || user.isVerified === false) {
      return res.status(401).json({ message: "Kamu belum terverifikasi" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = isVerified;
