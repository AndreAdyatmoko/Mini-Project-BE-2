const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
  // Mendapatkan token dari header permintaan
  const token = req.headers.authorization;

  // Cek apakah token ada
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verifikasi token menggunakan secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Menyimpan data pengguna yang terotentikasi ke dalam objek req untuk digunakan di rute berikutnya
    req.user = decoded;

    next(); // Melanjutkan ke rute berikutnya
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authentication;
