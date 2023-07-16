const { validationResult, check } = require('express-validator');

const validateRegistrationData = [
  check('username').notEmpty().withMessage('Username harus diisi'),
  check('email').isEmail().withMessage('Email tidak valid'),
  check('password').notEmpty().withMessage('Password harus diisi').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
];

const validateLoginData = [
  check('email').isEmail().withMessage('Email tidak valid'),
  check('password').notEmpty().withMessage('Password harus diisi'),
];

const validateResetPasswordData = [
  check('email').isEmail().withMessage('Email tidak valid'),
];

const validation = (req, res, next) => {
  // Melakukan validasi menggunakan express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next(); // Melanjutkan ke rute berikutnya
};

module.exports = {
  validateRegistrationData,
  validateLoginData,
  validateResetPasswordData,
  validation,
};
