const { body, validationResult } = require('express-validator');

const requireGantiPassword = [
  body('oldpassword')
    .notEmpty().withMessage('Password lama harus diisi'),
  body('newpassword')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .withMessage('Password baru harus memiliki minimal 6 karakter, minimal 1 huruf besar, minimal 1 simbol, dan minimal 1 angka'),
  body('confirmNewPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newpassword) {
        throw new Error('Konfirmasi password baru tidak sesuai');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = requireGantiPassword;
