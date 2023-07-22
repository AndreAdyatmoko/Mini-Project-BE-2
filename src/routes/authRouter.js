const {authController} = require('../controllers');
const router = require('express').Router();
const passwordValidatorMiddleware = require('../middlewares/passwordValidator')
const isVerified = require('../middlewares/isVerifiedMid')

router.post('/register', passwordValidatorMiddleware, authController.register);
router.patch('/verify/:id', authController.verifyEmail);
router.post('/login', isVerified, authController.login);

module.exports = router;
